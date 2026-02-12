from fastapi import Cookie
from settings import settings
from datetime import datetime, timedelta, timezone
from jose import jwt, JWTError
from db import findOne, save
import uuid

def get_user(user: str = Cookie(None)):
  if user:
    sql = f"select * from mini.`login` where `id` = '{user}'"
    result = findOne(sql)
    if result:
      return jwt.decode(result["token"], settings.secret_key, algorithms=settings.algorithm)
  return None
