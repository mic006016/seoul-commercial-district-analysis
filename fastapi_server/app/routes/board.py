from fastapi import APIRouter, HTTPException, Request
from db.dbt_ip import insight_ps, insight_ps_write, insight_ps_one, insight_ps_delete, insight_ps_update

router = APIRouter()

@router.get("/")
def select_bd():
  bd_list = insight_ps()
  print("게시판 리스트;", bd_list)
  return bd_list

@router.get("/{ip_id}")
def select_bd_one(ip_id:int):
  bd_one = insight_ps_one(ip_id)
  print("게시판 리스트;", bd_one)
  return bd_one

@router.post("/write")
async def write_bd_one(request: Request):
    """
    게시글 작성: 프론트에서 보내준 JSON 받아서 DB에 INSERT
    """
    data = await request.json()

    title = data.get("title")
    writer = data.get("writer")     # 프론트의 author -> DB ip_writer 로 매핑
    content = data.get("content")
    password = data.get("password")

    # 필수값 체크
    if not title or not writer or not content or not password:
        raise HTTPException(status_code=400, detail="필수 항목이 누락되었습니다.")

    new_id = insight_ps_write(title, writer, content, password)

    if not new_id:
        raise HTTPException(status_code=500, detail="게시글 저장에 실패했습니다.")

    return {"message": "등록 완료", "ip_id": new_id}
  
  
@router.delete("/{ip_id}")
async def delete_post(ip_id: int, request: Request):
    # 1) 프론트에서 보낸 JSON(body)에서 password 꺼내기
    data = await request.json()
    password = data.get("password")

    if not password:
        raise HTTPException(status_code=400, detail="비밀번호가 필요합니다.")

    # 2) DB에서 삭제 시도
    deleted_rows = insight_ps_delete(ip_id, password)
    
    # DB 자체 에러
    if deleted_rows < 0:
      raise HTTPException(status_code=500, detail="삭제 처리 중 오류가 발생했습니다.")

    # 3) 삭제 실패
    if deleted_rows == 0:
      # 글이 없거나 비밀번호가 틀린 경우
      raise HTTPException(
        status_code=403,
        detail="비밀번호가 일치하지 않거나 삭제된 글입니다."
      )

    return {"message": "삭제 완료"}
  
@router.put("/{ip_id}")
async def update_post(ip_id: int, request : Request):
    data = await request.json()
  
    title = data.get("title")
    content = data.get("content")
    password = data.get("password")
  
  # 1) 값이 비어 있으면 400
    if not title or not content or not password:
        raise HTTPException(status_code=400, detail="필수 항목이 누락되었습니다.")
  
  # 2) 실제 DB 수정
    updated_rows = insight_ps_update(ip_id, title, content,password)
  
    if updated_rows == 0:
    # 글이 없거나 비밀번호가 틀린 경우
      raise HTTPException(status_code=403, detail="비밀번호가 일치하지 않거나 글이 존재하지 않습니다.")
  
    return {"message": "수정 완료"}
  

