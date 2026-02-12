from fastapi import Cookie
from settings import settings
from datetime import datetime, timedelta, timezone
from jose import jwt, JWTError
from db import findOne, save
import uuid

def set_token(no: int, name: str):
  try:
    iat = datetime.now(timezone.utc) + (timedelta(hours=7))
    exp = iat + (timedelta(minutes=settings.access_token_expire_minutes))
    data = {
      "name": name,
      "iss": "mini",
      "sub": str(no),
      "iat": iat,
      "exp": exp
    }
    id = uuid.uuid4().hex
    token = jwt.encode(data, settings.secret_key, algorithm=settings.algorithm)
    sql = f"INSERT INTO mini.`login` (`id`, `user_no`, `token`) VALUE ('{id}', {no}, '{token}')"
    if save(sql): return id
  except JWTError as e:
    print(f"JWT ERROR : {e}")
  return None




def get_user(user: str = Cookie(None)):
  if user:
    sql = f"select * from edu.`login` where `id` = '{user}'"
    result = findOne(sql)
    if result:
      return jwt.decode(result["token"], settings.secret_key, algorithms=settings.algorithm)
  return None
