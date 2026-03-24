from fastapi import APIRouter
from db.dbt_result import read_qs, read_ags
from db.dbt_fp import read_fp
from db.dbt_ssi import read_ssi
from db.dbt_cai import read_cai
from db.dbt_ts import read_ts


router = APIRouter()

@router.get("/")
def result(gu: str, dong: str, category: str):
    body = {"gu": gu, "dong": dong, "category": category}
    qs_result = read_qs(body)
    ags_result = read_ags(body)
    fp_result = read_fp(body)
    ssi_result = read_ssi(body)
    cai_result = read_cai(body)
    ts_result = read_ts(body)
    return qs_result, ags_result, fp_result, ssi_result, cai_result, ts_result


