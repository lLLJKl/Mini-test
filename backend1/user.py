import os
import uuid
import base64
from datetime import datetime
from typing import Optional
from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field, EmailStr
from db import save, add_key, findOne # 사용하시는 db 모듈의 save 함수
from auth import get_user

router = APIRouter(prefix="/user", tags=["사용자"])

class UserModel(BaseModel):
    name: str = Field(..., title="이름")
    email: EmailStr = Field(..., title="이메일 주소")
    gender: int = Field(..., title="성별", description="0: 여자, 1: 남자")
    fileData: Optional[str] = Field(None, title="이미지 Base64 데이터")
    origin: Optional[str] = Field(None, title="원본 파일명")
    ext: Optional[str] = Field(None, title="확장자")

@router.patch("")
async def update_user(userModel: UserModel, payload = Depends(get_user)):
    if not payload:
        return {"status": False, "message": "인증 정보가 없습니다."}
    new_name = None

    if userModel.fileData:
        try:
            upload_dir = "./public/upload"
            if not os.path.exists(upload_dir):
                os.makedirs(upload_dir)
            new_name = f"{uuid.uuid4().hex}_{userModel.origin}"
            file_path = os.path.join(upload_dir, new_name)
            img_data = base64.b64decode(userModel.fileData)
            with open(file_path, "wb") as f:
                f.write(img_data)
        except Exception as e:
            print(f"파일 저장 에러: {e}")
            return {"status": False, "message": "이미지 저장 중 오류가 발생했습니다."}
    file_sql = ""
    if new_name:
        file_sql = f""", 
            `origin` = '{userModel.origin}', 
            `ext` = '{userModel.ext}', 
            `new_name` = '{new_name}'"""

    sql = f"""
        UPDATE mini.`user` SET 
            `name` = '{userModel.name}',
            `email` = '{userModel.email}',
            `gender` = {userModel.gender},
            `mod_date` = NOW()
            {file_sql}
        WHERE `no` = {payload["sub"]}
    """
    if save(sql):
        return {"status": True, "message": "사용자 정보가 성공적으로 수정되었습니다."}
    
    return {"status": False, "message": "데이터베이스 수정 중 오류가 발생했습니다."}

@router.post("/user")
def get_user_info(user = Depends(get_user)):
    user_no = user["no"]

    sql = f"""
        SELECT no, name, email, gender, reg_date, mod_date, profile
        FROM mini.`user`
        WHERE no = {user_no}
          AND del_yn = 0
    """

    result = findOne(sql)

    if result:
        return {
            "status": True,
            "result": result,
            "role": user.get("role", False)
        }

    return {
        "status": False,
        "message": "사용자 정보 없음"
    }


@router.patch("/user")
def delete_user(user = Depends(get_user)):
    user_no = user["no"]

    sql = f"""
        UPDATE mini.`user`
        SET 
            del_yn = 1,
            mod_date = NOW()
        WHERE no = {user_no}
    """

    result = add_key(sql)

    if result[0]:
        return {
            "status": True,
            "message": "회원 탈퇴 처리 완료"
        }

    return {
        "status": False,
        "message": "탈퇴 처리 실패"
    }
