from __future__ import annotations

from typing import Optional, Dict, Any, List
from pydantic import BaseModel

from db.status_map_db import (
    read_industry_counts_by_gu,
    read_fp_gender_sum_by_gu,
    read_open_close_weighted_by_gu,
)


class GuInfo(BaseModel):
    code: str
    name: str
    summary: Optional[str] = None


DUMMY_GU_DB: Dict[str, GuInfo] = {
    "11010": GuInfo(
        code="11010",
        name="종로구",
        summary="궁궐·한옥·관청이 밀집한 서울의 역사·행정 중심 축으로, 관광·문화 수요가 큰 도심 상권"
    ),
    "11020": GuInfo(
        code="11020",
        name="중구",
        summary="명동·을지로·남대문시장 등 전통 상권과 오피스가 공존하는 대표 도심 업무·상업 중심지"
    ),
    "11030": GuInfo(
        code="11030",
        name="용산구",
        summary="용산역·이태원·한강변 개발이 맞물린 교통·주거·상업 복합지로, 외국인·청년 유동이 두드러지는 지역"
    ),
    "11040": GuInfo(
        code="11040",
        name="성동구",
        summary="성수·왕십리를 축으로 제조업 지역이 창업·문화 거점으로 전환 중인 도심 인접 리모델링 상권"
    ),
    "11050": GuInfo(
        code="11050",
        name="광진구",
        summary="건대입구 일대 대학·유흥·쇼핑이 결합된 상권과 중랑천·한강을 낀 중밀도 주거지가 공존하는 동부 관문"
    ),
    "11060": GuInfo(
        code="11060",
        name="동대문구",
        summary="청량리·회기 축의 환승 거점과 재개발지, 노후 주거지가 함께 존재하는 동북권 교통·생활 거점"
    ),
    "11070": GuInfo(
        code="11070",
        name="중랑구",
        summary="중랑천 축을 따라 중저밀 주거와 전통시장 위주의 생활형 상권이 자리한 동북권 배후 주거지"
    ),
    "11080": GuInfo(
        code="11080",
        name="성북구",
        summary="대학·주거·전통주거가 섞인 중북부 주거 축으로, 정릉·성신여대 일대 생활·골목 상권이 특징"
    ),
    "11090": GuInfo(
        code="11090",
        name="강북구",
        summary="북한산·우이천을 낀 자연 인접 주거지로, 소규모 근린상권·생활 편의 업종 중심의 내수형 상권"
    ),
    "11100": GuInfo(
        code="11100",
        name="도봉구",
        summary="도봉산·수락산 등을 끼고 노후 아파트 단지와 소형 상가 위주의 정주형 생활권이 형성된 북부 거점"
    ),
    "11110": GuInfo(
        code="11110",
        name="노원구",
        summary="대규모 아파트 단지와 학원·교육·생활편의 상권이 결합된 동북권 최대급 주거·교육 중심지"
    ),
    "11120": GuInfo(
        code="11120",
        name="은평구",
        summary="불광·연신내 역세권과 응암·진관 신도심이 공존하는 서북권 관문으로, 배후 주거·생활 상권이 발달한 지역"
    ),
    "11130": GuInfo(
        code="11130",
        name="서대문구",
        summary="신촌·충정로·북가좌 일대로 대학·주거·관공서가 혼재한 도심 인접 주거·교육·업무 복합지"
    ),
    "11140": GuInfo(
        code="11140",
        name="마포구",
        summary="홍대·상암·공덕을 중심으로 문화·콘텐츠 산업과 오피스, 주거 수요가 밀집한 서북권 핵심 상권"
    ),
    "11150": GuInfo(
        code="11150",
        name="양천구",
        summary="목동 신시가지 아파트와 방송·교육 인프라를 기반으로 한 중산층 패밀리 수요 중심 주거 상권"
    ),
    "11160": GuInfo(
        code="11160",
        name="강서구",
        summary="김포공항·마곡지구 개발로 업무·연구·물류 기능이 커지고 있는 서부 관문이자 대규모 주거지"
    ),
    "11170": GuInfo(
        code="11170",
        name="구로구",
        summary="디지털단지(D-Cube, 구로디지털단지)를 축으로 IT·제조·물류 기능과 서남권 배후 주거지가 결합된 산업형 상권"
    ),
    "11180": GuInfo(
        code="11180",
        name="금천구",
        summary="가산·독산 디지털단지와 소규모 공장이 밀집한 서남권 제조·업무 거점이자 소형 임대 중심 주거지"
    ),
    "11190": GuInfo(
        code="11190",
        name="영등포구",
        summary="여의도 금융·방송 클러스터와 영등포·신도림 상권이 결합된 서남권 핵심 업무·상업 중심지"
    ),
    "11200": GuInfo(
        code="11200",
        name="동작구",
        summary="흑석·노량진·사당 일대로 교육·업무·주거 수요가 집중되며, 한강 조망 주거와 대입·공시 준비 수요가 공존하는 지역"
    ),
    "11210": GuInfo(
        code="11210",
        name="관악구",
        summary="서울대학교·고시촌·원룸 밀집지로 대표되는 청년·1~2인 가구 중심 주거·자취 상권"
    ),
    "11220": GuInfo(
        code="11220",
        name="서초구",
        summary="법조타운·교대·업무지구와 고급 주거지가 함께 형성된 강남 서측의 업무·주거 복합 상권"
    ),
    "11230": GuInfo(
        code="11230",
        name="강남구",
        summary="테헤란로·강남역·삼성역을 축으로 금융·IT·소비 트렌드가 집중된 대표적인 고밀도 업무·상업 중심 상권"
    ),
    "11240": GuInfo(
        code="11240",
        name="송파구",
        summary="잠실·문정·위례를 잇는 대규모 주거·업무·쇼핑 권역으로, 인구·소비 모두 상위권인 동남권 핵심 거점"
    ),
    "11250": GuInfo(
        code="11250",
        name="강동구",
        summary="천호·둔촌·고덕 생활권과 한강·수변공원이 어우러진 동남권 주거 중심지로, 재건축·신도시 개발이 이어지는 지역"
    ),
}


def get_gu_info(gu_code: str) -> Optional[GuInfo]:
    return DUMMY_GU_DB.get(gu_code)


def _top10_with_others(rows: List[Dict[str, Any]]) -> Dict[str, Any]:
    total = 0
    items = []
    for r in rows:
        name = r.get("industry_name")
        cnt = int(r.get("store_cnt") or 0)
        if not name:
            continue
        items.append({"name": name, "cnt": cnt})
        total += cnt

    top10 = items[:10]
    top10_sum = sum(x["cnt"] for x in top10)
    others_cnt = max(total - top10_sum, 0)

    def ratio(x: int) -> float:
        return 0.0 if total == 0 else x / total

    return {
        "total_store_cnt": total,                 # 전체 점포수
        "top10": [
            {"name": x["name"], "cnt": x["cnt"], "ratio": ratio(x["cnt"])}
            for x in top10
        ],
        "others_cnt": others_cnt,
        "others_ratio": ratio(others_cnt),
    }


def _gender_ratio(fp_total: int, fp_male: int, fp_female: int) -> Dict[str, Any]:
    total = int(fp_total or 0) // 90
    male = int(fp_male or 0) // 90
    female = int(fp_female or 0) // 90
    denom = male + female

    return {
        "fp_total": total,
        "fp_male": male,
        "fp_female": female,
        "male_ratio": 0.0 if denom == 0 else male / denom,
        "female_ratio": 0.0 if denom == 0 else female / denom,
    }


def get_gu_stats(gu_name: str, yqc: int = 20244) -> Dict[str, Any]:
    industry_rows = read_industry_counts_by_gu(gu_name, yqc)
    industry = _top10_with_others(industry_rows)

    fp_row = read_fp_gender_sum_by_gu(gu_name, yqc)
    fp = _gender_ratio(
        fp_total=fp_row.get("fp_total", 0),
        fp_male=fp_row.get("fp_male", 0),
        fp_female=fp_row.get("fp_female", 0),
    )

    oc_row = read_open_close_weighted_by_gu(gu_name, yqc)
    open_close = {
        "total_store_cnt": int(oc_row.get("total_store_cnt") or 0),
        "open_rate": float(oc_row.get("weighted_open_rate") or 0.0),
        "close_rate": float(oc_row.get("weighted_close_rate") or 0.0),
    }

    return {
        "gu_name": gu_name,
        "yqc": yqc,
        "industry_ratio": industry,
        "floating_pop_gender": fp,
        "open_close_rate": open_close,
    }
