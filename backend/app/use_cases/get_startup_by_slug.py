from typing import Optional
from app.entities.startup import Startup
from app.repositories.startup_repository import IStartupRepository
from app.repositories.cache_repository import CacheRepository


class GetStartupBySlugUseCase:
    def __init__(self, db_repo: IStartupRepository, cache_repo: CacheRepository):
        self.db_repo = db_repo
        self.cache_repo = cache_repo

    async def execute(self, slug: str) -> Optional[Startup]:
        """
        Fetches startup profile. Tries Redis cache first.
        Queries PostgreSQL on cache miss, then caches the result for 15 mins.
        """
        # 1. Try to read from Cache
        cached_profile = await self.cache_repo.get_startup_profile(slug)
        if cached_profile is not None:
            return cached_profile

        # 2. Query Database on Cache Miss
        startup = await self.db_repo.get_by_slug(slug)
        
        # 3. Cache the profile if found
        if startup is not None:
            await self.cache_repo.set_startup_profile(slug, startup, ttl=900)

        return startup
