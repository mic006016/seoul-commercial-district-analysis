from db.db_connection import get_connection
from pymysql import IntegrityError

MYSQL_TABLE = "time_sales"

def read_ts(body):
    try:
        con = get_connection()
        cursor = con.cursor()
        sql = f"SELECT t_00_06, t_06_11, t_11_14, t_14_17, t_17_21, t_21_24, yqc_code FROM {MYSQL_TABLE} WHERE dcm_code = (SELECT dcm_code FROM dong_code_master WHERE dcm_gu = %s AND dcm_dong = %s) AND sic_code = (SELECT sic_code FROM svc_industry_code WHERE sic_industry_group = %s) order by yqc_code"
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