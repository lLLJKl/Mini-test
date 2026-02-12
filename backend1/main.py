from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from settings import settings
import home
# import user
import board

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

apis = [ home.router, user.router, board.router ]
for router in apis:
  app.include_router(router)
