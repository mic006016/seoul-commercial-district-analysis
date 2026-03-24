from db.db_connection import get_connection
from pymysql import IntegrityError

MYSQL_TABLE = "store_status_info"

def read_ssi(body):
    try:
        con = get_connection()
        cursor = con.cursor()
        sql = f"SELECT ssi_cnt, ssi_similar_cnt, yqc_code FROM {MYSQL_TABLE} WHERE dcm_code = (SELECT dcm_code FROM dong_code_master WHERE dcm_gu = %s AND dcm_dong = %s) AND sic_code = (SELECT sic_code FROM svc_industry_code WHERE sic_industry_group = %s) order by yqc_code"
        cursor.execute(sql, (body["gu"], body["dong"], body["category"]))
        rows = cursor.fetchall()
        columns = [col[0] for col in cursor.description]
        result_ssi = [dict(zip(columns, row)) for row in rows]
        return result_ssi
    except Exception as e:
        print("업종 조회 오류:", e)
        return []
    finally:
        if con:
            con.close()