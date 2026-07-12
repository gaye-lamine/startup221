import abc
from sqlmodel.ext.asyncio.session import AsyncSession
from app.entities.lead import Lead


class ILeadRepository(abc.ABC):
    @abc.abstractmethod
    async def add(self, lead: Lead) -> Lead:
        """Insert a lead into the database."""
        pass


class PostgresLeadRepository(ILeadRepository):
    def __init__(self, session: AsyncSession):
        self.session = session

    async def add(self, lead: Lead) -> Lead:
        self.session.add(lead)
        await self.session.commit()
        await self.session.refresh(lead)
        return lead
