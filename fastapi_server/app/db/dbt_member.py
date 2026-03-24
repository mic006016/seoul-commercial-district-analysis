# db_crud.py
from app.db.db_connection import get_connection
from pymysql import IntegrityError

MYSQL_TABLE = "member"

# -------------------------
# CREATE
# -------------------------
def create(data):
    try:
        con = get_connection()
        cursor = con.cursor()
        sql = f"INSERT INTO {MYSQL_TABLE} (id, name, email, tel) VALUES (%s, %s, %s, %s)"
        result = cursor.execute(sql, data)
        con.commit()
        print("추가 성공" if result >= 1 else "추가 실패")
    except IntegrityError as e:
        print("무결성 에러:", e)
    finally:
        con.close()


# -------------------------
# READ ONE
# -------------------------
def read_one(member_id):
    try:
        con = get_connection()
        cursor = con.cursor()
        sql = f"SELECT * FROM {MYSQL_TABLE} WHERE id = %s"
        cursor.execute(sql, (member_id,))
        row = cursor.fetchone()
        print(row)
        return row
    except Exception as e:
        print("조회 오류:", e)
    finally:
        con.close()


# -------------------------
# READ ALL
# -------------------------
def read_all(limit=10):
    try:
        con = get_connection()
        cursor = con.cursor()
        sql = f"SELECT * FROM {MYSQL_TABLE}"
        cursor.execute(sql)
        rows = cursor.fetchmany(limit)
        print(rows)
        return rows
    except Exception as e:
        print("전체 조회 오류:", e)
    finally:
        con.close()


# -------------------------
# UPDATE
# -------------------------
def update(new_tel, member_id):
    try:
        con = get_connection()
        cursor = con.cursor()
        sql = f"UPDATE {MYSQL_TABLE} SET tel = %s WHERE id = %s"
        result = cursor.execute(sql, (new_tel, member_id))
        con.commit()
        print("수정 성공" if result >= 1 else "수정 실패")
    except Exception as e:
        print("업데이트 오류:", e)
    finally:
        con.close()


# -------------------------
# DELETE
# -------------------------
def delete(member_id):
    try:
        con = get_connection()
        cursor = con.cursor()
        sql = f"DELETE FROM {MYSQL_TABLE} WHERE id = %s"
        result = cursor.execute(sql, (member_id,))
        con.commit()
        print("삭제 성공" if result >= 1 else "삭제 실패")
    except Exception as e:
        print("삭제 오류:", e)
    finally:
        con.close()
