from fastapi import APIRouter
from db.dbt_sic import read_category

router = APIRouter()

@router.get("/")
def select_category():
    category_list = read_category()
    print("업종 리스트;", category_list)
    return category_list