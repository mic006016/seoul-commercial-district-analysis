from fastapi import APIRouter, HTTPException
from db.dbt_afn import read_afn

from model.model import predict_growth_label, lgb_model

router = APIRouter()

@router.get("/")
def ai_predict(
    gu: str,
    dong: str,
    category: str,
):
     # 0) 모델 체크
    if lgb_model is None:
        raise HTTPException(
            status_code=500,
            detail="모델이 로드되지 않았습니다. 서버 로그를 확인해주세요.",
        )
        
    # 1) DB에서 피처 조회
    feature_row = read_afn(gu=gu, dong=dong, category=category)
    if feature_row is None:
        raise HTTPException(
            status_code=404,
            detail="해당 구/동/업종에 대한 피처 데이터를 찾을 수 없습니다.",
        )

    # 2) 예측
    try:
        pred = predict_growth_label(
        feature_row=feature_row,
        gu=gu,
        dong=dong,
        category=category,
    )

    except RuntimeError as e:
        # model.py에서 모델 미로드 시 던진 에러
        raise HTTPException(status_code=500, detail=str(e))

    # 4) 프론트로 내려줄 응답 형태
    return {
        "request": {
            "gu": gu,
            "dong": dong,
            "category": category,
        },
        "prediction": pred
    }
