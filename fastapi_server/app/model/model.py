import os
import joblib
import pandas as pd
import numpy as np

from .report import make_report

# === 1) 경로 & 모델 로드 ===
BASE_DIR = os.path.dirname(os.path.abspath(__file__))  # /app/model
MODEL_PATH = os.path.join(BASE_DIR, "lgb_model_p2.pkl")

try:
    lgb_model = joblib.load(MODEL_PATH)
except Exception as e:
    lgb_model = None

# === 2) feature_cols / LABEL_MAP ===
feature_cols = [
    # 매출 규모/효율
    "qs_log", "qs_per_store",

    # 시장규모 변화
    "qs_total_diff_sqrt",

    # 경쟁 & 상권
    "store_density", "comp_pres",

    # 변화율 기반 원인 피처
    "comp_pres_pct",
    "qs_per_store_pct",
    "store_density_pct",
    "qs_1114_pct", "qs_1721_pct", "qs_2124_pct",
    "qs_weekdays_pct",
    "qs_weekend_pct",
    "qs_2030_pct", "qs_3050_pct", "qs_60_pct",

    # 입지
    "fp_log", "wp_log", "rp_log",
    "subway_station", "bus_log", "traffic_score",
    "apt_cnt", "apt_log",
]

LABEL_MAP = {0: "비추천", 1: "보류", 2: "추천"}


# === 3) 예측 로직 함수로 래핑 ===
def predict_growth_label(
    feature_row: dict,
    gu: str,
    dong: str,
    category: str,
) -> dict:
    """
    라우터에서:
      - read_afn() 결과(feature_row)
      - gu, dong, category (쿼리 파라미터)
    를 받아서 예측 + 리포트 생성.
    """
    if lgb_model is None:
        raise RuntimeError("모델이 로드되지 않았습니다.")

    # DataFrame 생성 (모델 입력용)
    row_vals = []
    for col in feature_cols:
        v = feature_row.get(col, 0.0)
        if v is None:
            v = 0.0
        try:
            v = float(v)
        except Exception:
            v = 0.0
        row_vals.append(v)

    df_x = pd.DataFrame([row_vals], columns=feature_cols)
    df_x = df_x.replace([np.inf, -np.inf], np.nan).fillna(0.0)
    # 예측
    y_pred = lgb_model.predict(df_x)[0]          # 0,1,2 중 하나
    y_pred_int = int(y_pred)
    label = LABEL_MAP.get(y_pred_int, str(y_pred_int))

    # 3) 리포트 텍스트 생성 (report.py 호출)
    report_text = make_report(
        gu=gu,
        dong=dong,
        category=category,
        feature_row=feature_row,
        label_index=y_pred_int,
    )

    # 5) 프론트로 전달할 구조
    return {
        "label": label,
        "label_index": y_pred_int,
        "report": report_text,
    }