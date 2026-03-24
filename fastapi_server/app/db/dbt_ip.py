from db.db_connection import get_connection

MYSQL_TABLE = "insight_post"

def insight_ps():
  try:
    con = get_connection()
    cursor = con.cursor()
    sql = f"""
        SELECT ip_id, ip_title, ip_content, ip_writer,
               ip_view_count, ip_created_at
        FROM {MYSQL_TABLE}
        ORDER BY ip_id DESC
    """
    cursor.execute(sql)
    rows = cursor.fetchall()
    columns = [col[0] for col in cursor.description]
    result_ps = [dict(zip(columns,row)) for row in rows]
    return result_ps
  except Exception as e:
    print("게시판 글 조회 오류:", e)
    return[]
  finally:
    if con:
      con.close()
      
def insight_ps_one(ip_id):
  try:
    con = get_connection()
    cursor = con.cursor()
    
    # 1) 조회수 1 증가
    update_sql = f"""
        UPDATE {MYSQL_TABLE}
        SET ip_view_count = ip_view_count + 1
        WHERE ip_id = %s
    """
    cursor.execute(update_sql, (ip_id,))
    con.commit()   # UPDATE 했으면 커밋
    
    # 2) 증가된 값 포함해서 다시 조회
    sql = f"""
        SELECT ip_id, ip_title, ip_content, ip_writer,
               ip_view_count, ip_created_at
        FROM {MYSQL_TABLE}
        WHERE ip_id = %s
    """
    cursor.execute(sql, (ip_id,))
    row = cursor.fetchone()
    
    if not row:
        return None
      
    columns = [col[0] for col in cursor.description]
    result_ps = dict(zip(columns,row))
    return result_ps
  
  except Exception as e:
    print("게시글 조회 (+ 조회수 증가) 오류:", e)
    return None
  
  finally:
    if con:
      con.close()

# write 글쓰기 함수 
def insight_ps_write(title, writer, content, password):
  try:
        con = get_connection()
        cursor = con.cursor()

        sql = f"""
            INSERT INTO {MYSQL_TABLE}
                (ip_title, ip_content, ip_writer, ip_pw)
            VALUES (%s, %s, %s, %s)
        """
        # 조회수는 처음 0으로, 나머지는 파라미터로 전달
        cursor.execute(sql, (title, content, writer, password))
        con.commit()

        # 방금 INSERT된 row의 PK (ip_id)
        return cursor.lastrowid

  except Exception as e:
        print("게시판 글 쓰기 오류:", e)
        return None

  finally:
        if con:
            con.close()

# delete 게시글 삭제 함수
def insight_ps_delete(ip_id, password):
  con = None
  try:
        con = get_connection()
        cursor = con.cursor()

        sql = f"""
            DELETE FROM {MYSQL_TABLE}
            WHERE ip_id = %s AND ip_pw = %s
        """
        # 삭제 게시글 넘버, 비밀번호
        cursor.execute(sql, (ip_id, password))
        con.commit()

        # 삭제된 행 개수 반환 (0이면 삭제 안된 것)
        return cursor.rowcount

  except Exception as e:
        print("게시판 글 삭제 오류:", e)
        return 0

  finally:
        if con:
            con.close()

# Update 게시글 수정 함수
def insight_ps_update(ip_id, title, content, password):
  try:
    con = get_connection()
    cursor = con.cursor()
    
    sql = f"""
      UPDATE {MYSQL_TABLE}
      SET ip_title = %s,
          ip_content = %s
      WHERE ip_id = %s
        AND ip_pw = %s
    """
    cursor.execute(sql,(title, content, ip_id, password))
    con.commit()
    
    # 영향 받은 row 수 (0이면 실패)
    return cursor.rowcount
  
  except Exception as e:
    print("게시판 글 수정 오류:", e)
    return 0
  
  finally:
      if con:
          con.close()
  
  
  


    
  