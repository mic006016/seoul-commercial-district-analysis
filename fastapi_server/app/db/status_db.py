from db.db_connection import get_connection
from pymysql import IntegrityError


def read_sales_by_gu(yqc_code: int):
    """
    분기(yqc_code)별 자치구 총 매출
    quarter_sales + dong_code_master
    """
    con = None
    try:
        con = get_connection()
        cursor = con.cursor()

        sql = """
            SELECT
                dcm.dcm_gu AS gu,
                SUM(qs.qs_sales) AS sales_total
            FROM quarter_sales AS qs
            JOIN dong_code_master AS dcm
              ON dcm.dcm_code = qs.dcm_code
            WHERE qs.yqc_code = %s
            GROUP BY dcm.dcm_gu
        """

        cursor.execute(sql, (yqc_code,))
        rows = cursor.fetchall()
        columns = [col[0] for col in cursor.description]
        result = [dict(zip(columns, row)) for row in rows]
        return result

    except IntegrityError as e:
        print("자치구 매출 조회 IntegrityError:", e)
        return []
    except Exception as e:
        print("자치구 매출 조회 오류:", e)
        return []
    finally:
        if con:
            con.close()


def read_stores_by_gu(yqc_code: int):
    """
    분기(yqc_code)별 자치구 총 점포수
    store_status_info + dong_code_master
    """
    con = None
    try:
        con = get_connection()
        cursor = con.cursor()

        sql = """
            SELECT
                dcm.dcm_gu AS gu,
                SUM(ssi.ssi_cnt) AS store_total
            FROM store_status_info AS ssi
            JOIN dong_code_master AS dcm
              ON dcm.dcm_code = ssi.dcm_code
            WHERE ssi.yqc_code = %s
            GROUP BY dcm.dcm_gu
        """

        cursor.execute(sql, (yqc_code,))
        rows = cursor.fetchall()
        columns = [col[0] for col in cursor.description]
        result = [dict(zip(columns, row)) for row in rows]
        return result

    except IntegrityError as e:
        print("자치구 점포수 조회 IntegrityError:", e)
        return []
    except Exception as e:
        print("자치구 점포수 조회 오류:", e)
        return []
    finally:
        if con:
            con.close()


def read_float_pop_by_gu(yqc_code: int):
    """
    분기(yqc_code)별 자치구 총 유동인구
    float_populat + dong_code_master
    """
    con = None
    try:
        con = get_connection()
        cursor = con.cursor()

        sql = """
            SELECT
                dcm.dcm_gu AS gu,
                SUM(fp.fp_total) AS float_total
            FROM float_populat AS fp
            JOIN dong_code_master AS dcm
              ON dcm.dcm_code = fp.dcm_code
            WHERE fp.yqc_code = %s
            GROUP BY dcm.dcm_gu
        """

        cursor.execute(sql, (yqc_code,))
        rows = cursor.fetchall()
        columns = [col[0] for col in cursor.description]
        result = [dict(zip(columns, row)) for row in rows]
        return result

    except IntegrityError as e:
        print("자치구 유동인구 조회 IntegrityError:", e)
        return []
    except Exception as e:
        print("자치구 유동인구 조회 오류:", e)
        return []
    finally:
        if con:
            con.close()
