from fastapi import FastAPI, APIRouter, Depends, Response
import uuid
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from kafka import KafkaProducer
from datetime import datetime, timedelta, timezone
from jose import jwt, JWTError
from settings import settings
from db import findOne, save, findAll, add_key
import json
import redis
import user
import board
import auth
import home


origins = [  "http://localhost:5173" ]
# settings.react_url,

app = FastAPI()


app.add_middleware(

  CORSMiddleware,
  allow_origins=origins,
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)


apis = [  user.router, board.router, auth.router, home.router ]
for router in apis:
  app.include_router(router)
  