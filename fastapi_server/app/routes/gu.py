from fastapi import APIRouter
from db.dbt_dcm import read_gu
from db.dbt_dcm import read_dong

router = APIRouter()

@router.get("/")
def select_gu():
    gu_list = read_gu()
    print("구 리스트;", gu_list)
    return gu_list

@router.get("/dong")
def select_dong(gu: str):
    dong_list = read_dong(gu)
    print("동 리스트;", dong_list)
    return dong_list

