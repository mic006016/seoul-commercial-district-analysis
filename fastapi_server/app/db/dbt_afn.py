from db.db_connection import get_connection
from pymysql import IntegrityError

MYSQL_TABLE = "ai_feature_name"

def read_afn(gu: str, dong: str, category: str):
    
    con = None
    try:           
        # 필수 파라미터 체크
        if not gu or not dong or not category:
              print("[AFN] 필수 파라미터 누락:", gu, dong, category)
              # 필수 파라미터 없으면 빈 리스트
              return []
            
        con = get_connection()
        cursor = con.cursor()
        
        # 1) 구 + 행정동명 -> dcm_code
        sql_dong = """
              SELECT dcm_code
              FROM dong_code_master
              WHERE dcm_gu = %s 
                AND dcm_dong = %s
              LIMIT 1
          """        
        cursor.execute(sql_dong, (gu, dong))
        row = cursor.fetchone()
        print("[AFN] dong_code_master row:", row)
   
        if not row:
              print("[AFN] 행정동 코드 없음:", gu, dong)
              return None
            
        dong_cd = row[0]    # ai_feature_name.dong_cd 와 매핑될 값
        print("[AFN] dong_cd:", dong_cd)
        
        # 2) 업종명(category) -> sic_code
        sql_biz = """
            SELECT sic_code
            FROM svc_industry_code
            WHERE sic_svc_industry = %s
            LIMIT 1
        """
        cursor.execute(sql_biz, (category,))
        row = cursor.fetchone()
        print("[AFN] svc_industry_code row:", row)
        
        if not row:
            print("[AFN] 업종 코드 없음:", category)
            return None
          
        business_cd = row[0]    # ai_feature_name.business_cd 와 매핑될 값
        print("[AFN] business_cd:", business_cd)
        
        # 3) ai_feature_name 에서 24개 피처 조회
        sql_afn = f"""
            SELECT
                qs_log,
                qs_per_store,
                qs_total_diff_sqrt,
                store_density,
                comp_pres,
                comp_pres_pct,
                qs_per_store_pct,
                store_density_pct,
                qs_1114_pct,
                qs_1721_pct,
                qs_2124_pct,
                qs_weekdays_pct,
                qs_weekend_pct,
                qs_2030_pct,
                qs_3050_pct,
                qs_60_pct,
                fp_log,
                wp_log,
                rp_log,
                subway_station,
                bus_log,
                traffic_score,
                apt_cnt,
                apt_log
            FROM {MYSQL_TABLE}
            WHERE dong_cd = %s
              AND business_cd = %s
            LIMIT 1
        """
        cursor.execute(sql_afn, (dong_cd, business_cd))
        row = cursor.fetchone()
        print("[AFN] ai_feature_name row:", row)
        
        if not row:
            print("[AFN] ai_feature_name 데이터 없음:", dong_cd, business_cd)
            return []
        
        # 컬럼 이름 가져와서 dict 로 변환
        columns = [desc[0] for desc in cursor.description]
        feature_row = dict(zip(columns, row))
        print("[AFN] feature_row:", feature_row)
        
        return feature_row
      
    except Exception as e:
        print("[AFN] AI조회 오류:", e)
        return None
    finally:
        if con:
            con.close()
