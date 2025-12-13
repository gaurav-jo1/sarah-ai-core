from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    database_url: str = "postgresql://user:pass@localhost/db"
    ml_service_url: str = "http://ml-service:8001"
    ml_service_timeout: float = 30.0

    log_level: str = "INFO"


    class Config:
            env_file = ".env"
            case_sensitive = False

settings = Settings()