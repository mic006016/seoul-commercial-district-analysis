from fastapi import APIRouter, HTTPException
from pathlib import Path
from fastapi.responses import Response
from model.status_map_model import get_gu_info
from model.status_map_model import get_gu_stats

router = APIRouter(tags=["StatusMap"])

BASE_DIR = Path(__file__).resolve().parents[2]   
GEOJSON_PATH = Path(__file__).resolve().parents[1] / "static" / "file" / "seoul_gu.geojson"

@router.get("/", summary="서울 25개 구 GeoJSON")
def get_status_map():
    if not GEOJSON_PATH.is_file():
        raise HTTPException(status_code=500, detail=f"not found: {GEOJSON_PATH}")

    text = GEOJSON_PATH.read_text(encoding="utf-8")
    return Response(content=text, media_type="application/geo+json")

@router.get("/gu_info/{gu_code}")
def gu_info(gu_code: str):
    info = get_gu_info(gu_code)
    if info is None:
        raise HTTPException(status_code=404, detail=f"unknown gu_code: {gu_code}")

    return {
        "name": info.name,
        "summary": info.summary,
    }

@router.get("/gu_stats")
def gu_stats(gu_name: str, yqc: int = 20244):
    data = get_gu_stats(gu_name=gu_name, yqc=yqc)
    return data
