import pandas as pd
import glob
import os

# 1. 파일 경로 패턴 지정 ('점포-행정동'이 포함된 모든 연도 csv 찾기)
file_pattern = '*상권분석서비스(점포-행정동)_*.csv'
file_list = glob.glob(file_pattern)

print(f"찾은 파일 개수: {len(file_list)}개")

# 2. 한글 -> 영문 컬럼명 매핑 딕셔너리
rename_dict = {
    '기준_년분기_코드': 'yq_cd',
    '행정동_코드': 'dong_cd',
    '행정동_코드_명': 'dong_nm',
    '서비스_업종_코드': 'biz_cd',
    '서비스_업종_코드_명': 'biz_nm',
    '점포_수': 'store_cnt',
    '유사_업종_점포_수': 'similar_store_cnt',
    '개업_율': 'open_rate',
    '개업_점포_수': 'open_store_cnt',
    '폐업_률': 'close_rate',
    '폐업_점포_수': 'close_store_cnt',
    '프랜차이즈_점포_수': 'franchise_cnt'
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
df_store_all = pd.concat(df_list, axis=0, ignore_index=True)

# 5. 모델링(TimeSeriesSplit)을 위한 사전 정렬 (시간 -> 동 -> 업종)
df_store_all = df_store_all.sort_values(['dong_cd', 'biz_cd', 'yq_cd']).reset_index(drop=True)

print(f"\n=== 2019~2024년 점포 데이터 통합 완료 ===")
print(f"총 데이터 크기: {df_store_all.shape}")

# 통합된 데이터를 하나의 csv로 저장해두기
df_store_all.to_csv("점포_행정동_통합_2019_2024.csv", index=False, encoding='utf-8-sig')