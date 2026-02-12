from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import FileResponse
from pathlib import Path
from pydantic import BaseModel
from typing import List
from fastapi.middleware.cors import CORSMiddleware
import shutil
import uuid

class FileItem(BaseModel):
  filename: str
  content_type: str
  content_base64: str

class FileModel(BaseModel):
  txt: str
  files: List[str]

origins = [ "http://localhost:5173" ]

app = FastAPI()
app.add_middleware(
  CORSMiddleware,
  allow_origins=origins,
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)

UPLOAD_DIR = Path("uploads")
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif", "webp"}
MAX_FILE_SIZE = 10 * 1024
FILE_CONTENT_TYPE = "image/png"

db = []

def checkDir():
  UPLOAD_DIR.mkdir(exist_ok=True)

def saveFile(file):
  checkDir()
  origin = file.filename
  ext = origin.split(".")[-1].lower()
  id = uuid.uuid4().hex
  new_name = f"{id}.{ext}"
  data = { "id": id, "origin": origin, "ext": ext, "new_name": new_name }
  db.append(data)
  path = UPLOAD_DIR / new_name
  with path.open("wb") as f:
    shutil.copyfileobj(file.file, f)

# @app.get("/")
# def root():
#   return {"status": True}

# @app.post("/upload")
# def upload(files: List[UploadFile] = File(), txt: str = Form()):
#   print(txt)
#   for file in files:
#     saveFile(file)
#   return {"status": True}

@app.post("/upload")
def upload(model: FileModel, files: List[UploadFile] = File()):
  print(model)
  print(files)
  for file in files:
    saveFile(file)
    saveFile(model)
  return {"status": True}

# @app.get("/images")
# def images():
#   return {"status": True, "result": db}

# # @app.get("/download")
# # def download(id: str):
# #   for row in db:
# #     if row["id"] == id:
# #       newName = row["newName"]
# #       origin = row["origin"]
# #       break
# #   if newName:
# #     print(newName)
# #     path = UPLOAD_DIR / newName
# #     return FileResponse(path=path, filename=origin)
# #   return {"status": False}
