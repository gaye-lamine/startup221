import abc
from typing import List, Tuple, Optional
from sqlmodel import select, func, or_, col, cast, String
from sqlmodel.ext.asyncio.session import AsyncSession
from app.entities.startup import Startup


class IStartupRepository(abc.ABC):
    @abc.abstractmethod
    async def get_all(
        self,
        *,
        limit: int,
        offset: int,
        search: Optional[str] = None,
        sectors: Optional[List[str]] = None,
        employee_size_ranges: Optional[List[str]] = None,
        seeking_needs: Optional[List[str]] = None,
    ) -> Tuple[List[Startup], int]:
        """Fetch startups with filters and pagination, returning list and total count."""
        pass

    @abc.abstractmethod
    async def add(self, startup: Startup) -> Startup:
        """Insert a new startup into the database."""
        pass

    @abc.abstractmethod
    async def get_by_slug(self, slug: str) -> Optional[Startup]:
        """Fetch startup details by slug."""
        pass


class PostgresStartupRepository(IStartupRepository):
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_all(
        self,
        *,
        limit: int,
        offset: int,
        search: Optional[str] = None,
        sectors: Optional[List[str]] = None,
        employee_size_ranges: Optional[List[str]] = None,
        seeking_needs: Optional[List[str]] = None,
    ) -> Tuple[List[Startup], int]:
        # Build query
        query = select(Startup)
        
        # 1. Global Search (Case-insensitive match on name or description)
        if search:
            search_pattern = f"%{search}%"
            query = query.where(
                or_(
                    col(Startup.name).ilike(search_pattern),
                    col(Startup.description).ilike(search_pattern),
                )
            )

        # 2. Sector Filter
        if sectors:
            query = query.where(col(Startup.sector).in_(sectors))

        # 3. Employee Count / Team Size Filters
        if employee_size_ranges:
            size_conditions = []
            for range_str in employee_size_ranges:
                if range_str == "1-10":
                    size_conditions.append(
                        (Startup.employee_count >= 1) & (Startup.employee_count <= 10)
                    )
                elif range_str == "11-50":
                    size_conditions.append(
                        (Startup.employee_count >= 11) & (Startup.employee_count <= 50)
                    )
                elif range_str == "51+":
                    size_conditions.append(Startup.employee_count >= 51)
            
            if size_conditions:
                query = query.where(or_(*size_conditions))

        # 4. Seeking/Need Filters (Matching JSON list elements)
        # Using string representation check for reliability across database backends/mock drivers
        if seeking_needs:
            need_conditions = []
            for need in seeking_needs:
                # Cast the JSON column to string and check if it contains the need
                need_conditions.append(cast(Startup.seeking, String).ilike(f'%"{need}"%'))
            if need_conditions:
                query = query.where(or_(*need_conditions))

        # Execute total count query
        count_query = select(func.count()).select_from(query.subquery())
        count_result = await self.session.execute(count_query)
        total_count = count_result.scalar_one_or_none() or 0

        # Apply pagination & ordering
        query = query.order_by(col(Startup.created_at).desc())
        query = query.offset(offset).limit(limit)

        result = await self.session.execute(query)
        startups = result.scalars().all()

        return list(startups), total_count

    async def add(self, startup: Startup) -> Startup:
        self.session.add(startup)
        await self.session.commit()
        await self.session.refresh(startup)
        return startup

    async def get_by_slug(self, slug: str) -> Optional[Startup]:
        query = select(Startup).where(col(Startup.slug) == slug)
        result = await self.session.execute(query)
        return result.scalar_one_or_none()
