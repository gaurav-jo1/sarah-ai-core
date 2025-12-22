import json
import redis
from typing import List, Dict
from datetime import timedelta
# from settings.settings import api_settings


class ChatMemoryManager:
    def __init__(self):
        self.redis = redis.Redis(host='redis', port=6379, decode_responses=True)
        self.message_ttl = timedelta(hours=24)  # Messages expire after 24 hours

    def _get_session_key(self, session_id: str) -> str:
        """Generate Redis key for a chat session"""
        return f"chat:session:{session_id}"

    def add_message(
        self, session_id: str, role: str, content: str, metadata: Dict = None
    ):
        """Add a message to the chat history"""
        key = self._get_session_key(session_id)

        message = {"role": role, "content": content, "metadata": metadata or {}}

        # Add message to list
        self.redis.rpush(key, json.dumps(message))

        # Set expiration
        self.redis.expire(key, self.message_ttl)

    def get_history(self, session_id: str) -> List[Dict]:
        """Retrieve full chat history for a session"""
        key = self._get_session_key(session_id)

        # Get ALL messages
        messages = self.redis.lrange(key, 0, -1)

        return [json.loads(msg) for msg in messages]

    def get_formatted_history(self, session_id: str) -> str:
        """Get full chat history formatted for LLM context"""
        history = self.get_history(session_id)

        formatted = []
        for msg in history:
            formatted.append(f"{msg['role'].upper()}: {msg['content']}")

        return "\n".join(formatted)

    def clear_session(self, session_id: str):
        """Clear all messages for a session"""
        key = self._get_session_key(session_id)
        self.redis.delete(key)

    def session_exists(self, session_id: str) -> bool:
        """Check if a session exists"""
        key = self._get_session_key(session_id)
        return self.redis.exists(key) > 0
