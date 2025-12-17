from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    GEMINI_API_KEY: str

api_settings = Settings()