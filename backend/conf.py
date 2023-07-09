from typing import Any
from pydantic import BaseSettings, Field
from pathlib import Path


class BaseConfig(BaseSettings):
    MODE: str = Field(..., regex="(DEVELOPMENT|STAGING|PRODUCTION)")
    LOG_LEVEL: str = Field("DEBUG", regex="(DEBUG|INFO|WARNING|ERROR|CRITICAL)")
    SECRET_KEY: str = Field(..., env="SECRET_KEY")

    class Config:
        env_file = f"{Path(__file__).resolve().parent.parent}/.env"


class DatabaseConfig(BaseConfig):
    NAME: str = Field("numanibnmazid_portfolio", env="DATABASE_NAME")
    USER: str = Field("numanibnmazid", env="DATABASE_USER")
    HOST: str = Field(..., env="DATABASE_HOST")
    PORT: int = Field(5432, env="DATABASE_PORT")
    PASSWORD: str = Field(..., env="DATABASE_PASSWORD")


class ProjectConfig(BaseConfig):
    DATABASE = DatabaseConfig()


class ProjectDevelopmentConfig(ProjectConfig):
    ...


class ProjectStagingConfig(ProjectConfig):
    ...


class ProjectProductionConfig(ProjectConfig):
    ...


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
