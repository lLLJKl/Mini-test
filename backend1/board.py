from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field 
from db import findAll, findOne, save
from auth import get_user
import 

router = APIRouter(prefix="/board",tags=["게시판"])

class Reply_add_model(BaseModel):
    content: str = Field(..., title="", description="댓글 내용")
    

@router.post("/{no}")
def board(no: int, payload = Depends(get_user)):
    sql = f"""
        SELECT b.`no`, b.`title`,b.`name`,b.`content`, b.`user_no` ,
        DATE_FORMAT(b.`reg_date`, '%Y-%m-%d %H:%i:%s') as reg_date
         FROM mini.`board` AS b
        INNER JOIN mini.`user` AS u
             ON (b.`user_no` = u.`no` AND u.`del_yn` = 0)
        WHERE b.`del_yn`=0
        AND b.`no` = {no}     
          """
    result = findOne(sql)
    if result:
        if payload:
            role = int(payload["sub"]) ==result["user_no"]
        else:
            role = False
        return {"status": True, "result": result, "role":role}
    return{"status": False, "message": "없는 글입니다"}


    
@router.delete("/{no}")
def board(no: int, payload= Depends(get_user)):
    if payload:
        sql = f"""UPDATE mini.`board` 
            SET `del_yn` = 1  
            WHERE `no` = {no}"""
        if save(sql):
            return{"status": True,"message": "삭제되었습니다"}
        return{"status": False, "message": "오류가 발생되어 삭제되지않았습니다"}


@router.post("")
def reply( payload= Depends(get_user)):
    if payload:
        sql = f"""INSERT INTO mini.`reply` (`content`,`user_name`, `reg_date`)
             WHERE `no` = {no}
            """
        if save(sql):
            return{"status": True, "message": "댓글이 등록되었습니다"}
        return
            
        
  