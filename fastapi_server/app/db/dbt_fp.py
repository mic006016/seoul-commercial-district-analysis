from db.db_connection import get_connection
from pymysql import IntegrityError

MYSQL_TABLE = "float_populat"

def read_fp(body):
    try:
        con = get_connection()
        cursor = con.cursor()
        sql = f"SELECT fp_total, fp_male, fp_female, fp_age10, fp_age20, fp_age30, fp_age40, fp_age50, fp_age60, yqc_code FROM {MYSQL_TABLE} WHERE dcm_code = (SELECT dcm_code FROM dong_code_master WHERE dcm_gu = %s AND dcm_dong = %s) order by yqc_code"
        cursor.execute(sql, (body["gu"], body["dong"]))
        rows = cursor.fetchall()
        columns = [col[0] for col in cursor.description]
        result_fp = [dict(zip(columns, row)) for row in rows]
        return result_fp
    except Exception as e:
        print(" 유동인구 조회 오류:", e)
        return []
    finally:
        if con:
            con.close()