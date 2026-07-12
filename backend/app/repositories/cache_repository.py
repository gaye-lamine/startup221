import json
from typing import List, Tuple, Optional, Any
from app.core.redis import redis_client
from app.entities.startup import Startup


class CacheRepository:
    def __init__(self):
        self.redis = redis_client

    def _generate_key(self, limit: int, offset: int) -> str:
        return f"startups:default:limit_{limit}:offset_{offset}"

    async def get_startups(self, limit: int, offset: int) -> Optional[Tuple[List[Startup], int]]:
        """Retrieve cached default startup list and total count."""
        key = self._generate_key(limit, offset)
        cached_data = await self.redis.get(key)
        
        if not cached_data:
            return None

        try:
            data = json.loads(cached_data)
            # Reconstruct Startup models from cached dictionaries
            startups = [Startup(**item) for item in data.get("items", [])]
            total = data.get("total", 0)
            return startups, total
        except Exception:
            return None

    async def set_startups(
        self, limit: int, offset: int, startups: List[Startup], total: int, ttl: int = 600
    ) -> None:
        """Store default startup list and total count in cache with a TTL (default 10 mins)."""
        key = self._generate_key(limit, offset)
        
        # Serialize list of SQLModels
        items = []
        for s in startups:
            # sqlmodel uses .model_dump() in pydantic v2
            if hasattr(s, "model_dump"):
                items.append(s.model_dump(mode="json"))
            else:
                items.append(s.dict())

        payload = {
            "items": items,
            "total": total
        }
        
        await self.redis.set(key, json.dumps(payload), ex=ttl)

    def _generate_profile_key(self, slug: str) -> str:
        return f"startup:profile:{slug}"

    async def get_startup_profile(self, slug: str) -> Optional[Startup]:
        """Retrieve cached startup profile by slug."""
        key = self._generate_profile_key(slug)
        cached_data = await self.redis.get(key)
        if not cached_data:
            return None
        try:
            data = json.loads(cached_data)
            return Startup(**data)
        except Exception:
            return None

    async def set_startup_profile(self, slug: str, startup: Startup, ttl: int = 900) -> None:
        """Cache startup profile with 15-minute default TTL."""
        key = self._generate_profile_key(slug)
        if hasattr(startup, "model_dump"):
            data = startup.model_dump(mode="json")
        else:
            data = startup.dict()
        await self.redis.set(key, json.dumps(data), ex=ttl)
