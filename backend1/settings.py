from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
  kafka_topic: str = "test"
  kafka_server: str = "192.168.0.230:9094"

  mail_username: str
  mail_password: str
  mail_from: str
  mail_port: int = 587
  mail_server: str = "smtp.gmail.com"
  mail_from_name: str = "mini"
  mail_starttls: bool = True
  mail_ssl_tls: bool = False
  use_credentials: bool = True
  validate_certs: bool = True

  redis_host: str = "redis"
  redis_port: int = 6379
  redis_db: int = 0

  mariadb_user: str = "ljb"
  mariadb_password: str = "1234"
  mariadb_host: str = "192.168.0.230"
  mariadb_database: str = "mini"
  mariadb_port: int = 23306

  react_url: str
  secret_key: str
  algorithm: str

  access_token_expire_minutes: int

  cookie_name: str
  cookie_secure: bool
  cookie_samesite: str

  model_config = SettingsConfigDict(
    env_file=".env",
    env_file_encoding="utf-8",
  )

settings = Settings()