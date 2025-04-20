from typing import Any
from pydantic import Field
from pydantic_settings import BaseSettings
from pathlib import Path


class BaseConfig(BaseSettings):
    MODE: str = Field(..., pattern="(DEVELOPMENT|STAGING|PRODUCTION)")
    LOG_LEVEL: str = Field("DEBUG", pattern="(DEBUG|INFO|WARNING|ERROR|CRITICAL)")
    SECRET_KEY: str = Field(..., alias="SECRET_KEY")
    DJANGO_LOG_LEVEL: str = Field("INFO", alias="DJANGO_LOG_LEVEL")
    CLOUDINARY_CLOUD_NAME: str = Field(..., alias="CLOUDINARY_CLOUD_NAME")
    CLOUDINARY_API_KEY: str = Field(..., alias="CLOUDINARY_API_KEY")
    CLOUDINARY_API_SECRET: str = Field(..., alias="CLOUDINARY_API_SECRET")
    BACKEND_BASE_URL: str = Field(..., alias="BACKEND_BASE_URL")

    class Config:
        env_file = f"{Path(__file__).resolve().parent.parent}/.env"
        extra = "allow"


class DatabaseConfig(BaseConfig):
    NAME: str = Field("numanibnmazid_portfolio", alias="DATABASE_NAME")
    USER: str = Field("numanibnmazid", alias="DATABASE_USER")
    HOST: str = Field(..., alias="DATABASE_HOST")
    PORT: int = Field(5432, alias="DATABASE_PORT")
    PASSWORD: str = Field(..., alias="DATABASE_PASSWORD")


class RedisConfig(BaseConfig):
    REDIS_HOST: str = Field("localhost", alias="REDIS_HOST")
    REDIS_PORT: str = Field("6379", alias="REDIS_PORT")
    REDIS_DB: str = Field("1", alias="REDIS_DB")


class ProjectConfig(BaseConfig):
    DATABASE: BaseConfig = DatabaseConfig()
    REDIS: BaseConfig = RedisConfig()


class ProjectDevelopmentConfig(ProjectConfig): ...


class ProjectStagingConfig(ProjectConfig): ...


class ProjectProductionConfig(ProjectConfig): ...


class ConfigFactory:
    def __init__(self, project_env_state: str) -> None:
        self.project_env_state = project_env_state

    def __call__(self) -> Any:
        if self.project_env_state == "PRODUCTION":
            return ProjectProductionConfig()
        elif self.project_env_state == "STAGING":
            return ProjectStagingConfig()
        return ProjectDevelopmentConfig()


config = ConfigFactory(ProjectConfig().MODE)()
