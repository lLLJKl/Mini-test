from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from kafka import KafkaProducer
from datetime import datetime, timedelta, timezone
from jose import jwt, JWTError
from settings import settings
from db import findOne, save
import json
import redis
import uuid

app = FastAPI()

origins = [settings.react_url]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

def set_token(no: int):
  try:
    result = findOne(f"SELECT `no` FROM mini.user WHERE `email` = '{no}'")
    if result:
      iat = datetime.now(timezone.utc) + (timedelta(hours=7))
      exp = iat + (timedelta(minutes=settings.access_token_expire_minutes))
      data = {
        "iss": "EDU",
        "sub": str(result["no"]),
        "iat": iat,
        "exp": exp
      }
      id = uuid.uuid4().hex
      token = jwt.encode(data, settings.secret_key, algorithm=settings.algorithm)
      sql = f"INSERT INTO mini.`login` (`id`, `user_no`, `token`) VALUE ('{id}', {result["no"]}, '{token}')"
      if save(sql): return id
  except JWTError as e:
    print(f"JWT ERROR : {e}")
  return None

@app.post("/check_email")
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

@app.post("/signup")
def signup(model: SignUpModel):
    sql = f"""
      INSERT INTO mini.`user` (`name`, `email`, `gender`)
      VALUES ('{model.name}', '{model.email}', {model.gender})
    """
    save(sql)
    return {"status": True}

@app.post("/login")
def login(model: LoginModel):
    pd.send(settings.kafka_topic, dict(model))
    pd.flush()
    return{"status":True}

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

def checkUser(code: str):
  client = redis.Redis(
    host=settings.redis_host,
    port=settings.redis_port,
    db=1,
    decode_responses=True
  )
  result = client.get(code)
  if result:
    client.delete(code)
    return result
  return None

@app.post("/code")
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