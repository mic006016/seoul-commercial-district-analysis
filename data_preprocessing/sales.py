import pandas as pd
import glob
import os

# 1. 파일 경로 패턴 지정 ('점포-행정동'이 포함된 모든 연도 csv 찾기)
file_pattern = '*상권분석서비스(추정매출-행정동)_*.csv'
file_list = glob.glob(file_pattern)

print(f"찾은 파일 개수: {len(file_list)}개")

# 2. 한글 -> 영문 컬럼명 매핑 딕셔너리
rename_dict = {
    '기준_년분기_코드': 'yq_cd',
    '행정동_코드': 'dong_cd',
    '행정동_코드_명': 'dong_nm',
    '서비스_업종_코드': 'biz_cd',
    '서비스_업종_코드_명': 'biz_nm',
    '당월_매출_금액': 'sls_amt_tot',
    '당월_매출_건수': 'sls_cnt_tot',
    '주중_매출_금액': 'sls_amt_wkdy',
    '주말_매출_금액': 'sls_amt_wknd',
    '월요일_매출_금액': 'sls_amt_mon',
    '화요일_매출_금액': 'sls_amt_tue',
    '수요일_매출_금액': 'sls_amt_wed',
    '목요일_매출_금액': 'sls_amt_thu',
    '금요일_매출_금액': 'sls_amt_fri',
    '토요일_매출_금액': 'sls_amt_sat',
    '일요일_매출_금액': 'sls_amt_sun',
    '시간대_00~06_매출_금액': 'sls_amt_0006',
    '시간대_06~11_매출_금액': 'sls_amt_0611',
    '시간대_11~14_매출_금액': 'sls_amt_1114',
    '시간대_14~17_매출_금액': 'sls_amt_1417',
    '시간대_17~21_매출_금액': 'sls_amt_1721',
    '시간대_21~24_매출_금액': 'sls_amt_2124',
    '남성_매출_금액': 'sls_amt_m',
    '여성_매출_금액': 'sls_amt_f',
    '연령대_10_매출_금액': 'sls_amt_10s',
    '연령대_20_매출_금액': 'sls_amt_20s',
    '연령대_30_매출_금액': 'sls_amt_30s',
    '연령대_40_매출_금액': 'sls_amt_40s',
    '연령대_50_매출_금액': 'sls_amt_50s',
    '연령대_60_이상_매출_금액': 'sls_amt_60s',
    '주중_매출_건수': 'sls_cnt_wkdy',
    '주말_매출_건수': 'sls_cnt_wknd',
    '월요일_매출_건수': 'sls_cnt_mon',
    '화요일_매출_건수': 'sls_cnt_tue',
    '수요일_매출_건수': 'sls_cnt_wed',
    '목요일_매출_건수': 'sls_cnt_thu',
    '금요일_매출_건수': 'sls_cnt_fri',
    '토요일_매출_건수': 'sls_cnt_sat',
    '일요일_매출_건수': 'sls_cnt_sun',
    '시간대_건수~06_매출_건수': 'sls_cnt_0006',
    '시간대_건수~11_매출_건수': 'sls_cnt_0611',
    '시간대_건수~14_매출_건수': 'sls_cnt_1114',
    '시간대_건수~17_매출_건수': 'sls_cnt_1417',
    '시간대_건수~21_매출_건수': 'sls_cnt_1721',
    '시간대_건수~24_매출_건수': 'sls_cnt_2124',
    '남성_매출_건수': 'sls_cnt_m',
    '여성_매출_건수': 'sls_cnt_f',
    '연령대_10_매출_건수': 'sls_cnt_10s',
    '연령대_20_매출_건수': 'sls_cnt_20s',
    '연령대_30_매출_건수': 'sls_cnt_30s',
    '연령대_40_매출_건수': 'sls_cnt_40s',
    '연령대_50_매출_건수': 'sls_cnt_50s',
    '연령대_60_이상_매출_건수': 'sls_cnt_60s',
}

# 3. 파일 순회하며 처리하기
df_list = []
for file in file_list:
    file_name = os.path.basename(file)
    print(f"[{file_name}] 읽기 및 컬럼명 변경 중...")
    
    # 3-1. 파일 읽기 (공공데이터 표준 인코딩 cp949)
    df_temp = pd.read_csv(file, encoding='cp949')
    
    # 3-2. 컬럼명 일괄 변경
    df_temp.rename(columns=rename_dict, inplace=True)
    
    # 3-3. 처리된 데이터프레임을 리스트에 담기
    df_list.append(df_temp)

# 4. 세로로 하나의 파일로 병합
df_sales_all = pd.concat(df_list, axis=0, ignore_index=True)

# 5. 모델링(TimeSeriesSplit)을 위한 사전 정렬 (시간 -> 동 -> 업종)
df_sales_all = df_sales_all.sort_values(['dong_cd', 'biz_cd', 'yq_cd']).reset_index(drop=True)

print(f"\n=== 2019~2024년 추정매출 데이터 통합 완료 ===")
print(f"총 데이터 크기: {df_sales_all.shape}")

# 통합된 데이터를 하나의 csv로 저장해두기
df_sales_all.to_csv("추정매출_행정동_통합_2019_2024.csv", index=False, encoding='utf-8-sig')