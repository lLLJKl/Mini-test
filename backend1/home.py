from fastapi import APIRouter, Depends, Response
from pydantic import BaseModel, EmailStr
from kafka import KafkaProducer
from settings import settings
from db import findOne, save, findAll, add_key
from auth import set_token
import json
import redis

class SignUpModel(BaseModel):
    name: str
    email: EmailStr
    gender: bool

class LoginModel(BaseModel):
    email: EmailStr

class CodeModel(BaseModel):
    id: str


kafka_server=settings.kafka_server
kafka_topic=settings.kafka_topic

pd = KafkaProducer(
  bootstrap_servers=kafka_server,
  value_serializer=lambda v: json.dumps(v).encode("utf-8")
)

router = APIRouter(tags=["회원관리"])



@router.post("/check_email")
def check_email(email: EmailStr):
    sql = f"""
      SELECT COUNT(*) AS state
      FROM mini.`user`
      WHERE `email`='{email}'
    """
    result = findOne(sql)
    if result:
        print(result["state"])
        return {"status": result["state"] == 1}
    return {"status": False}

@router.post("/signup")
def signup(model: SignUpModel):
    sql = f"""
      INSERT INTO mini.`user` (`name`, `email`, `gender`)
      VALUES ('{model.name}', '{model.email}', {model.gender})
    """
    save(sql)
    return {"status": True}

@router.post("/login")
def login(model: LoginModel):
    pd.send(settings.kafka_topic, dict(model))
    pd.flush()
    return{"status":True}

@router.post("/logout")
def logout(response: Response):
  response.delete_cookie(key="user")
  return {"status": True}

def checkCode(code: str):
  client = redis.Redis(
    host=settings.redis_host,
    port=settings.redis_port,
    db=0,
    decode_responses=True
  )
  result = client.get(code)
  if result:
    client.delete(code)
    return result
  return None

@router.post("/code")
def code(model: CodeModel, response : Response):
  print(model.id)
  result = checkCode(model.id)
  if result:
    id = set_token(result)
    if id:
      response.set_cookie(
      key="user",
      value=id,
      max_age=60 * 30,
      expires=60 * 30,
      # path="/",
      # domain="react",
      secure=False,
      httponly=True,
      samesite="lax",
    )
      return {"status": True}
  return {"status": False}
