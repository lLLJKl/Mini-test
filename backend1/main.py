from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import board
import auth
import home

origins = [  "http://localhost:5173" ]

app = FastAPI()


app.add_middleware(

  CORSMiddleware,
  allow_origins=origins,
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)


apis = [  board.router, auth.router, home.router ]
for router in apis:
  app.include_router(router)
  