from db.db_connection import get_connection
from pymysql import IntegrityError

MYSQL_TABLE = "svc_industry_code"

def read_category():
    try:
        con = get_connection()
        cursor = con.cursor()
        sql = f"SELECT sic_industry_group FROM {MYSQL_TABLE} ORDER BY sic_industry_group ASC"
        cursor.execute(sql)
        rows = cursor.fetchall()
        category_list = [row[0] for row in rows]
        return category_list
    except Exception as e:
        print("업종 조회 오류:", e)
        return []
    finally:
        if con:
            con.close()