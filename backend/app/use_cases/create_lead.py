import uuid
from typing import Optional
from app.entities.lead import Lead
from app.repositories.lead_repository import ILeadRepository


class CreateLeadUseCase:
    def __init__(self, lead_repo: ILeadRepository):
        self.lead_repo = lead_repo

    async def execute(
        self,
        *,
        startup_id: uuid.UUID,
        sender_name: str,
        sender_entity: str,
        sender_email: str,
        message_type: str,
    ) -> Lead:
        """
        Creates a contact lead message for a specific startup.
        """
        lead = Lead(
            startup_id=startup_id,
            sender_name=sender_name,
            sender_entity=sender_entity,
            sender_email=sender_email,
            message_type=message_type,
        )
        return await self.lead_repo.add(lead)
