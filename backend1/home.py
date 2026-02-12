from fastapi import APIRouter, Response
from pydantic import BaseModel, Field, EmailStr
from auth import set_token
from db import findOne, add_key, save
from settings import settings

router = APIRouter(tags=["회원관리"])

class LoginModel(BaseModel):
  email: EmailStr = Field(..., title="이메일 주소", description="로그인를 위한 이메일 주소 입니다.")
  pwd: str = Field(..., title="비밀번호", description="로그인를 위한 비밀번호 입니다.")

class SignUpModel(BaseModel):
  name: str = Field(..., title="이름", description="사용자 식별를 위한 이름 입니다.")
  email: EmailStr = Field(..., title="이메일 주소", description="사용자 식별를 위한 이메일 주소 입니다.")
  gender: bool = Field(..., title="성별", description="사용자 식별를 위한  성별 입니다.")

@router.get("/")
def read_root():
  return {"Hello": "World"}

@router.post("/login")
def login(model : LoginModel, response : Response):
  sql = settings.login_sql.replace("{email}", model.email).replace("{pwd}", model.pwd)
  data = findOne(sql)
  if data:
    access_token = set_token(data["no"], data["name"])
    response.set_cookie(
      key="user",
      value=access_token,
      max_age=60 * 60,
      expires=60 * 60,
      # path="/",
      # domain="react",
      secure=False,
      httponly=True,
      samesite="lax",
    )
    return {"status": True}
  else:
    return {"status": False}

@router.post("/logout")
def logout(response: Response):
  response.delete_cookie(key="user")
  return {"status": True}

@router.put("/signUp")
def signUp(signUpModel: SignUpModel, response : Response):
  sql = f"""insert into mini.`user` 
    (`name`, `email`,`gender`) 
    value 
    ('{signUpModel.name}', '{signUpModel.email}', {signUpModel.gender})
    """
  save(sql)
  return {"status": True}
  return {"status": False, "message": "사용자 등록 중 오류가 발생 하였습니다."}
