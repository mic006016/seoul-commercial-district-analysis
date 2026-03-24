from fastapi import APIRouter
from model.status_model import read_status_summary

router = APIRouter()

def prev_quarter(yqc: int, n: int = 1) -> int:
    """yqc=YYYYQ 형태(예: 20244)에서 n분기 이전 코드 반환"""
    year = yqc // 10
    q = yqc % 10
    for _ in range(n):
        if q > 1:
            q -= 1
        else:
            year -= 1
            q = 4
    return year * 10 + q

@router.get("/")
def status(yqc: int = 20244):
    prev_yqc  = prev_quarter(yqc, 1)  # 20243
    prev2_yqc = prev_quarter(yqc, 2)  # 20242
    prev3_yqc = prev_quarter(yqc, 3)  # 20241
    prev4_yqc = prev_quarter(yqc, 4)  # 20234

    data = read_status_summary(yqc, prev_yqc, prev2_yqc, prev3_yqc, prev4_yqc)
    return data
