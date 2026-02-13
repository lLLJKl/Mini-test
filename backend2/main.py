from fastapi import FastAPI
from kafka import KafkaConsumer
from settings import settings
import threading
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType
import asyncio
import json
import random
import string
import redis

kafka_server=settings.kafka_server
kafka_topic=settings.kafka_topic

app = FastAPI(title="Consumer")

client = redis.Redis(
  host=settings.redis_host,
  port=settings.redis_port,
  db=settings.redis_db
)

conf = ConnectionConfig(
  MAIL_USERNAME = settings.mail_username,
  MAIL_PASSWORD = settings.mail_password,
  MAIL_FROM = settings.mail_from,
  MAIL_PORT = settings.mail_port,
  MAIL_SERVER = settings.mail_server,
  MAIL_FROM_NAME = settings.mail_from_name,
  MAIL_STARTTLS = settings.mail_starttls,
  MAIL_SSL_TLS = settings.mail_ssl_tls,
  USE_CREDENTIALS = settings.use_credentials,
  VALIDATE_CERTS = settings.validate_certs
)
# simple_send: producer에서 보낸 email 정보를 id를 생성하여 id:email 형식으로 redis에 저장하기 위한 일종의 redis 레시피 부분입니다.
async def simple_send(email: str):
  # key = uuid.uuid4().hex
  id = ''.join(random.choices(string.digits, k=6))
  client.setex(id, 60*3, email)
  html = f"""
    <h1>Login Service</h1>
    <p>{id}</p>
  """

  message = MessageSchema(
    subject="일회용 인증 코드 발급",
    recipients=[ email ],
    body=html,
    subtype=MessageType.html)

  fm = FastMail(conf)
  await fm.send_message(message)


# kafka consumer 함수 부분입니다. 이 부분에서 redis에서 id:email의 id 부분(코드 6자리)를 만들고 전달하기 위한 함수 입니다. 
def consumer():
  cs = KafkaConsumer(
    kafka_topic, 
    bootstrap_servers=kafka_server, 
    enable_auto_commit=True,
    value_deserializer=lambda v: json.loads(v.decode("utf-8"))
  )
  for msg in cs:
    print(msg)
    asyncio.run(simple_send(msg.value["email"]))


# 실질적으로 메일을 발송하게 되는 트리거 엔드포인트 입니다.
@app.on_event("startup")
def startConsumer():
  thread = threading.Thread(target=consumer, daemon=True)
  thread.start()

@app.get("/")
def read_root():
  return {"status": True}