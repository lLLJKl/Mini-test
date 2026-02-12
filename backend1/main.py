from fastapi import FastAPI, APIRouter, Depends
from pydantic import BaseModel, Field
from db import findAll, findOne, save



app = FastAPI()

@app.post("/")
def get_user():
  return {"Hello": "World"}


@app.put("/")
def 