from fastapi import APIRouter, File, UploadFile, Form
from fastapi.responses import FileResponse
from pathlib import Path
from pydantic import BaseModel
from typing import List
import shutil
import uuid
from db import findOne, findAll, save, add_key

class FileModel(BaseModel):
  txt: str
  files: List[str]

  
UPLOAD_DIR = Path("uploads")
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif", "webp"}
MAX_FILE_SIZE = 10 * 1024
FILE_CONTENT_TYPE = "image/png"

router = APIRouter(prefix="/upload", tags=["이미지업로드"])

def checkDir():
  UPLOAD_DIR.mkdir(exist_ok=True)

def saveFile(file):
  checkDir()
  id = uuid.uuid4().hex
  origin = file.filename 
  ext = file.filename.split(".")[-1].lower()
  new_name = f"{uuid.uuid4().hex}.{ext}"
  sql = f"""
      insert into mini.`user` (`origin`, `ext`,`new_name`,)
      value ('{origin}','{ext}','{new_name}')
      """
  result = add_key(sql)
  if result[0]:
    path = UPLOAD_DIR/ new_name
    with path.open("wb") as f:
      shutil.copyfileobj(file.file, f)
    return result[1]
  return 0 


@router.post("")
def upload(files: List[UploadFile] = File(), txt : str = Form()):
  print(txt)
  arr = []
  for file in files:
    arr.append(saveFile(file))
  return {"status" : True, "result": arr }

@router.get("/images")
def images():
    sql = "select * from edu.`file` order by no desc"
    return {"status": True, "result": findAll(sql)}
