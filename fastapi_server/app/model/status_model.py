from db.status_db import (
    read_sales_by_gu,
    read_stores_by_gu,
    read_float_pop_by_gu,
)


def _attach_rank(rows):
    """
    정렬된 rows에 rank 키 추가
    """
    for idx, row in enumerate(rows, start=1):
        row["rank"] = idx
    return rows


def _to_dict_by_gu(rows, value_key):
    """
    [{gu: '강남구', value_key: 123}, ...] -> {'강남구': 123, ...}
    """
    result = {}
    for row in rows:
        gu = row.get("gu")
        val = row.get(value_key)
        if gu is not None:
            result[gu] = val
    return result


def read_status_summary(
    yqc_code: int,
    prev_yqc: int,
    prev2_yqc: int,
    prev3_yqc: int,
    prev4_yqc: int,
) -> dict:
    """
    상권현황 요약 (자치구 TOP3 세 가지 지표)

    - 자치구 점포당 매출 TOP3
    - 자치구 매출 성장률 TOP3 (현재/전/전전 분기 매출 포함)
    - 자치구 일 평균 유동인구 TOP3
    """

    # 1) 분기별 자치구 매출 / 점포수 / 유동인구 집계 가져오기
    sales_curr_rows  = read_sales_by_gu(yqc_code)   # 20244
    sales_prev1_rows = read_sales_by_gu(prev_yqc)   # 20243
    sales_prev2_rows = read_sales_by_gu(prev2_yqc)  # 20242
    sales_prev3_rows = read_sales_by_gu(prev3_yqc)  # 20241
    sales_prev4_rows = read_sales_by_gu(prev4_yqc)  # 20234


    stores_curr_rows = read_stores_by_gu(yqc_code)
    float_curr_rows = read_float_pop_by_gu(yqc_code)

    # dict로 변환: {gu: 값}
    sales_curr  = _to_dict_by_gu(sales_curr_rows, "sales_total")
    sales_prev1 = _to_dict_by_gu(sales_prev1_rows, "sales_total")
    sales_prev2 = _to_dict_by_gu(sales_prev2_rows, "sales_total")
    sales_prev3 = _to_dict_by_gu(sales_prev3_rows, "sales_total")
    sales_prev4 = _to_dict_by_gu(sales_prev4_rows, "sales_total")

    
    stores_curr = _to_dict_by_gu(stores_curr_rows, "store_total")
    float_curr  = _to_dict_by_gu(float_curr_rows, "float_total")
  
    # 2) 자치구 점포당 매출 TOP3
    sales_per_store_list = []
    for gu, sales_total in sales_curr.items():
        store_total = stores_curr.get(gu, 0)
        if store_total and store_total > 0:
            value = float(sales_total) / float(store_total)
            sales_per_store_list.append(
                {
                    "gu": gu,
                    "gu_sales": float(sales_total),
                    "gu_stores": int(store_total),
                    "value": value,  # 점포당 매출
                }
            )

    sales_per_store_list.sort(key=lambda x: x["value"], reverse=True)
    sales_per_store_top3 = _attach_rank(sales_per_store_list[:3])


    # 3) 자치구 매출 연평균성장률(CAGR) TOP3 (최근 1년)
    sales_growth_list = []

    for gu, sales_end in sales_curr.items():
        sales_start = sales_prev4.get(gu)

        # 시작값 없으면 계산 불가
        if sales_start is None or sales_start == 0:
            continue

        # 중간 분기 누락 방지 (권장)
        if (
            gu not in sales_prev3
            or gu not in sales_prev2
            or gu not in sales_prev1
        ):
            continue

        # CAGR (1년 = 4분기)
        cagr = (float(sales_end) / float(sales_start)) - 1

        sales_growth_list.append(
            {
                "gu": gu,
                "sales_20234": float(sales_start),
                "sales_20241": float(sales_prev3[gu]),
                "sales_20242": float(sales_prev2[gu]),
                "sales_20243": float(sales_prev1[gu]),
                "sales_20244": float(sales_end),
                "value": cagr,  # 연평균성장률
            }
        )

    sales_growth_list.sort(key=lambda x: x["value"], reverse=True)
    sales_growth_top3 = _attach_rank(sales_growth_list[:3])


    # 4) 자치구 일 평균 유동인구 TOP3
    #    분기 유동인구 합 / 90일
    float_list = []
    for gu, float_total in float_curr.items():
        daily = int(round(float(float_total) / 90.0))
        float_list.append(
            {
                "gu": gu,
                "quarter_fp": int(float(float_total)),
                "value": daily,  # 일 평균 유동인구
            }
        )

    float_list.sort(key=lambda x: x["value"], reverse=True)
    float_pop_top3 = _attach_rank(float_list[:3])


    # 5) 최종 결과
    result = {
        "yqc": yqc_code,
        "prev_yqc": prev_yqc,
        "prev2_yqc": prev2_yqc,
        "sales_per_store_top3": sales_per_store_top3,
        "sales_growth_top3": sales_growth_top3,
        "float_pop_top3": float_pop_top3,
    }
    return result
