from __future__ import annotations

from typing import Any, Dict, List, Tuple
from pymysql import IntegrityError
from db.db_connection import get_connection


def _normalize_gu_names(gu_name: str) -> Tuple[str, str]:
    g = (gu_name or "").strip()
    if not g:
        return "", ""
    if g.endswith("구"):
        return g, g[:-1]
    return g, g + "구"


def _fetch_all(sql: str, params: Tuple[Any, ...]) -> List[Dict[str, Any]]:
    con = None
    try:
        con = get_connection()
        cursor = con.cursor()
        cursor.execute(sql, params)
        rows = cursor.fetchall()
        cols = [c[0] for c in cursor.description]
        return [dict(zip(cols, r)) for r in rows]
    except IntegrityError as e:
        print("status_map_db IntegrityError:", e)
        return []
    except Exception as e:
        print("status_map_db Error:", e)
        return []
    finally:
        if con:
            con.close()


def _fetch_one(sql: str, params: Tuple[Any, ...]) -> Dict[str, Any]:
    rows = _fetch_all(sql, params)
    return rows[0] if rows else {}


def read_industry_counts_by_gu(gu_name: str, yqc: int) -> List[Dict[str, Any]]:
    gu1, gu2 = _normalize_gu_names(gu_name)
    sql = """
        SELECT
            sic.sic_svc_industry AS industry_name,
            SUM(ssi.ssi_cnt) AS store_cnt
        FROM store_status_info AS ssi
        JOIN dong_code_master AS dcm
          ON dcm.dcm_code = ssi.dcm_code
        JOIN svc_industry_code AS sic
          ON sic.sic_code = ssi.sic_code
        WHERE ssi.yqc_code = %s
          AND dcm.dcm_gu IN (%s, %s)
        GROUP BY sic.sic_svc_industry
        ORDER BY store_cnt DESC
    """
    return _fetch_all(sql, (yqc, gu1, gu2))


def read_fp_gender_sum_by_gu(gu_name: str, yqc: int) -> Dict[str, Any]:
    gu1, gu2 = _normalize_gu_names(gu_name)
    sql = """
        SELECT
            COALESCE(SUM(fp.fp_total), 0)  AS fp_total,
            COALESCE(SUM(fp.fp_male), 0)   AS fp_male,
            COALESCE(SUM(fp.fp_female), 0) AS fp_female
        FROM float_populat AS fp
        JOIN dong_code_master AS dcm
          ON dcm.dcm_code = fp.dcm_code
        WHERE fp.yqc_code = %s
          AND dcm.dcm_gu IN (%s, %s)
    """
    return _fetch_one(sql, (yqc, gu1, gu2))


def read_open_close_weighted_by_gu(gu_name: str, yqc: int) -> Dict[str, Any]:
    gu1, gu2 = _normalize_gu_names(gu_name)
    sql = """
        SELECT
            COALESCE(SUM(ssi.ssi_cnt), 0) AS total_store_cnt,
            CASE
                WHEN COALESCE(SUM(ssi.ssi_cnt), 0) = 0 THEN 0
                ELSE COALESCE(SUM(ssi.ssi_cnt * COALESCE(ssi.ssi_open_rate, 0)), 0)
                     / SUM(ssi.ssi_cnt)
            END AS weighted_open_rate,
            CASE
                WHEN COALESCE(SUM(ssi.ssi_cnt), 0) = 0 THEN 0
                ELSE COALESCE(SUM(ssi.ssi_cnt * COALESCE(ssi.ssi_close_rate, 0)), 0)
                     / SUM(ssi.ssi_cnt)
            END AS weighted_close_rate
        FROM store_status_info AS ssi
        JOIN dong_code_master AS dcm
          ON dcm.dcm_code = ssi.dcm_code
        WHERE ssi.yqc_code = %s
          AND dcm.dcm_gu IN (%s, %s)
    """
    return _fetch_one(sql, (yqc, gu1, gu2))
