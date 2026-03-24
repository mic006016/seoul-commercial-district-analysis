from db.db_connection import get_connection
from pymysql import IntegrityError

MYSQL_TABLE = "commercial_area_infra"

def read_cai(body):
    try:
        con = get_connection()
        cursor = con.cursor()
        sql = f"SELECT cai_bus_stop, cai_subway, cai_school_ele, cai_school_mid, cai_school_hig, cai_university, yqc_code FROM {MYSQL_TABLE} WHERE dcm_code = (SELECT dcm_code FROM dong_code_master WHERE dcm_gu = %s AND dcm_dong = %s) order by yqc_code"
        cursor.execute(sql, (body["gu"], body["dong"]))
        rows = cursor.fetchall()
        columns = [col[0] for col in cursor.description]
        result_cai = [dict(zip(columns, row)) for row in rows]
        return result_cai
    except Exception as e:
        print(" 유동인구 조회 오류:", e)
        return []
    finally:
        if con:
            con.close()