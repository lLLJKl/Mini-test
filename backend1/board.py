from fastapi import APIRouter, Depends,Cookie
from pydantic import BaseModel, Field
from db import findAll, findOne, save, add_key
from auth import get_user


router = APIRouter(prefix="/board",tags=["게시판"])

class ReplyModel(BaseModel):
    boardNo: int
    content: str

class BoardAddModel(BaseModel):
  title: str = Field(..., title="제목", description="게시글 제목 입니다.")
  content: str = Field(..., title="내용", description="게시글 내용 입니다.")

class BoardEditModel(BaseModel):
   content: str  = Field(..., title="내용", description="게시글에서 수정할 내용 입니다.")

@router.post("/add")  
def board_add(boardAddModel: BoardAddModel, payload=Depends(get_user), user: str = Cookie(None)):
  if not payload or not user:
    return {"status": False, "message": "로그인이 필요합니다."}

  login_row = findOne(f"SELECT `user_no` FROM mini.`login` WHERE `id`='{user}'")
  if not login_row:
    return {"status": False, "message": "로그인 정보가 없습니다."}

  sql = (
    f"INSERT INTO mini.`board` (`title`, `content`, `user_no`) "
    f"VALUES ('{boardAddModel.title}', '{boardAddModel.content}', {login_row['user_no']})"
  )
  data = add_key(sql)
  if data[0]:
    return {"status": True, "message": "게시글 추가 완료", "result": data[1]}
  return {"status": False, "message": "게시글 추가 중 오류"}




# 1. 게시글 상세 조회 (함수명: get_board_detail)
@router.get("/{no}")
def get_board_detail(no: int, payload = Depends(get_user)):
    # b.`content` 뒤에 있던 쉼표(,)를 제거했습니다.
    # 작성자 이름을 가져오기 위해 u.`name`을 선택합니다.
    sql = f"""
        SELECT b.`no`, b.`title`, u.`name`, b.`content`, b.`user_no`
        FROM mini.`board` AS b
        INNER JOIN mini.`user` AS u ON (b.`user_no` = u.`no` AND u.`del_yn` = 0)
        WHERE b.`del_yn` = 0 AND b.`no` = {no}
    """
    result = findOne(sql)
    if result:
        # 작성자 본인 확인 로직
        role = False
        if payload and int(payload["sub"]) == result["user_no"]:
            role = True
        return {"status": True, "result": result, "role": role}
    return {"status": False, "message": "존재하지 않는 게시글입니다."}

@router.post("/reply") # 프론트와 메서드 통일 (post 또는 put)
def add_reply(data: ReplyModel, payload = Depends(get_user)):
    if not payload:
        return {"status": False, "message": "로그인이 필요합니다."}
    
    # payload['sub']는 보통 유저의 pk(no)입니다.
    user_no = payload.get("sub")
    
    # SQL 저장 로직 (테이블 구조에 맞게 수정하세요)
    sql = f"""
        INSERT INTO mini.`reply` (`board_no`, `user_no`, `content`) 
        VALUES ({data.boardNo}, {user_no}, '{data.content}')
    """
    
    if save(sql):
        return {"status": True, "message": "댓글 등록 완료"}
    return {"status": False, "message": "댓글 등록 중 오류 발생"}

@router.patch("/edit")
def edit_data(no: int, boardEditModel: BoardEditModel, playload = Depends(get_user)):
   if playload:
      sql = f"""
            UPDATE mini.`board` 
            SET `content` = '{boardEditModel.content}' WHERE `no` = {no}
            """
      if save(sql):
         return{"status": True, "message":"게시글이 수정되었습니다."}
   return{"status": False,"message":"게시글 수정중 오류발생"} 

@router.delete("/{no}")
def board(no: int, payload = Depends(get_user)):
  if payload:
    sql = f"UPDATE mini.`board` SET `delYn` = 1 WHERE `no` = {no}"
    if save(sql):
      return {"status": True, "message": "게시글 삭제가 정상 처리가 되었습니다."}
  return {"status": False, "message": "게시글 삭제 중 오류가 발생 되었습니다."}
