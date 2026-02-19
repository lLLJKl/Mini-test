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
    row = findOne(f"""
      SELECT `del_yn`
      FROM mini.`user`
      WHERE `email` = '{model.email}'
      LIMIT 1
    """)
    if not row:
        return {"status": False, "message": "존재하지 않는 계정입니다."}
    if str(row["del_yn"]) != "0":
        return {"status": False, "message": "비활성화된 계정입니다."}

    pd.send(settings.kafka_topic, dict(model))
    pd.flush()
    return {"status": True}

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
def code(model: CodeModel, response: Response):
  result = checkCode(model.id)  # result = email 이라고 가정
  if not result:
    return {"status": False, "message": "인증 코드가 유효하지 않습니다."}

  user_row = findOne(f"""
    SELECT `no`, `del_yn`
    FROM mini.`user`
    WHERE `email` = '{result}'
    LIMIT 1
  """)
  if not user_row:
    return {"status": False, "message": "존재하지 않는 계정입니다."}

  if int(user_row["del_yn"]) == 1:
    return {"status": False, "message": "비활성화된 계정입니다. 관리자에게 문의하세요."}
  
  id = set_token(result)
  if id:
    response.set_cookie(
      key="user",
      value=id,
      max_age=60 * 30,
      expires=60 * 30,
      secure=False,
      httponly=True,
      samesite="lax",
    )
    return {"status": True}

  return {"status": False, "message": "토큰 발급 실패"}
