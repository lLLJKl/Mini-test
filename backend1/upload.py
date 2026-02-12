import base64
import uuid
import os
from pathlib import Path
from typing import List
from fastapi import FastAPI, Depends
from pydantic import BaseModel
from db import save
from auth import get_user

class FileModel(BaseModel):
    txt: str
    files: List[str] 

app = FastAPI()
UPLOAD_DIR = Path("uploads")

@app.post("/upload")
async def upload(model: FileModel, payload = Depends(get_user)):
    if not payload:
        return {"status": False, "message": "로그인이 필요합니다."}
    user_no = payload["sub"] 
    UPLOAD_DIR.mkdir(exist_ok=True)

    success_files = []

    for base64_str in model.files:
        file_id = uuid.uuid4().hex
        ext = "jpg","png","gif","webp"
        new_name = f"{file_id}.{ext}"
        origin_name = "web_upload"
        
        try:
            path = UPLOAD_DIR / new_name
            img_data = base64.b64decode(base64_str)
            with open(path, "wb") as f:
                f.write(img_data)
            sql = f"""
                UPDATE mini.`user` SET 
                    `origin` = '{origin_name}',
                    `ext` = '{ext}',
                    `new_name` = '{new_name}',
                    `mod_date` = NOW()
                WHERE `no` = {user_no}
            """
            if save(sql):
                success_files.append(new_name)
                
        except Exception as e:
            print(f"저장 중 에러: {e}")
    return {
        "status": True, 
        "message": f"{len(success_files)}개의 파일이 DB에 기록되었습니다."
    }