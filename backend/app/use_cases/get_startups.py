from typing import List, Tuple, Optional
from app.repositories.startup_repository import IStartupRepository
from app.repositories.cache_repository import CacheRepository
from app.entities.startup import Startup


class GetStartupsUseCase:
    def __init__(self, db_repo: IStartupRepository, cache_repo: CacheRepository):
        self.db_repo = db_repo
        self.cache_repo = cache_repo

    async def execute(
        self,
        *,
        limit: int,
        offset: int,
        search: Optional[str] = None,
        sectors: Optional[List[str]] = None,
        employee_size_ranges: Optional[List[str]] = None,
        seeking_needs: Optional[List[str]] = None,
    ) -> Tuple[List[Startup], int]:
        """
        Executes listing logic. Checks cache for default queries (no filters).
        Otherwise fetches directly from PostgreSQL database.
        """
        # A query is considered default if no filter criteria are supplied
        is_default = not (
            search
            or (sectors and len(sectors) > 0)
            or (employee_size_ranges and len(employee_size_ranges) > 0)
            or (seeking_needs and len(seeking_needs) > 0)
        )

        if is_default:
            # Check cache
            cached_result = await self.cache_repo.get_startups(limit, offset)
            if cached_result is not None:
                return cached_result

        # Cache miss or filtered query -> Query database
        startups, total = await self.db_repo.get_all(
            limit=limit,
            offset=offset,
            search=search,
            sectors=sectors,
            employee_size_ranges=employee_size_ranges,
            seeking_needs=seeking_needs,
        )

        # Save to cache if it's the default query
        if is_default:
            await self.cache_repo.set_startups(limit, offset, startups, total, ttl=600)

        return startups, total
