import pandas as pd
import os

print("=== [Step 0] 공통 기준키 설정 ===")
# 점포/매출 베이스 병합 키 (업종 포함)
base_keys = ['yq_cd', 'dong_cd', 'dong_nm', 'biz_cd', 'biz_nm']
# 나머지 지역 지표 브로드캐스팅 키 (업종 제외)
broad_keys = ['yq_cd', 'dong_cd']

print("\n=== [Step 1] 점포와 추정매출 Inner Join ===")
df_store = pd.read_csv('점포_행정동_통합_2019_2024.csv')
df_sales = pd.read_csv('추정매출_행정동_통합_2019_2024.csv')

# Inner Join으로 타겟(매출)이 존재하는 유효 데이터만 뼈대로 삼음
df_master = pd.merge(df_store, df_sales, on=base_keys, how='inner')
print(f"뼈대 생성 완료: {df_master.shape}")

print("\n=== [Step 2] 행정동별 지표 데이터 브로드캐스팅 (Left Join) ===")

# 2-1. 불러올 파일 이름과 변경할 핵심 컬럼명 세팅
datasets_info = [
    {
        'file': '서울시 상권분석서비스(길단위인구-행정동).csv',
        'rename': {'기준_년분기_코드': 'yq_cd', '행정동_코드': 'dong_cd', '행정동_코드_명': 'dong_nm', 
                   '총_유동인구_수': 'fl_pop_tot', '남성_유동인구_수': 'fl_pop_m', '여성_유동인구_수': 'fl_pop_f', 
                   '연령대_10_유동인구_수': 'fl_pop_10s', '연령대_20_유동인구_수': 'fl_pop_20s', '연령대_30_유동인구_수': 'fl_pop_30s', 
                   '연령대_40_유동인구_수': 'fl_pop_40s', '연령대_50_유동인구_수': 'fl_pop_50s', '연령대_60_이상_유동인구_수': 'fl_pop_60s', 
                   '시간대_00_06_유동인구_수': 'fl_pop_0006', '시간대_06_11_유동인구_수': 'fl_pop_0611',
                   '시간대_11_14_유동인구_수': 'fl_pop_1114', '시간대_14_17_유동인구_수': 'fl_pop_1417', 
                   '시간대_17_21_유동인구_수': 'fl_pop_1721', '시간대_21_24_유동인구_수': 'fl_pop_2124'}
    },
    {
        'file': '서울시 상권분석서비스(상주인구-행정동).csv',
        'rename': {'기준_년분기_코드': 'yq_cd', '행정동_코드': 'dong_cd', '행정동_코드_명': 'dong_nm', 
                   '총_상주인구_수': 'rs_pop_tot', '남성_상주인구_수': 'rs_pop_m', '여성_상주인구_수': 'rs_pop_f',
                   '연령대_10_상주인구_수': 'rs_pop_10s', '연령대_20_상주인구_수': 'rs_pop_20s', '연령대_30_상주인구_수': 'rs_pop_30s',
                   '연령대_40_상주인구_수': 'rs_pop_40s', '연령대_50_상주인구_수': 'rs_pop_50s', '연령대_60_이상_상주인구_수': 'rs_pop_60s',
                   '총_가구_수': 'rs_hh_tot', '아파트_가구_수': 'rs_hh_apt', '비_아파트_가구_수': 'rs_hh_nonapt'}
    },
    {
        'file': '서울시 상권분석서비스(직장인구-행정동).csv',
        'rename': {'기준_년분기_코드': 'yq_cd', '행정동_코드': 'dong_cd', '행정동_코드_명': 'dong_nm',
                   '총_직장_인구_수': 'wk_pop_tot', '남성_직장_인구_수': 'wk_pop_m', '여성_직장_인구_수': 'wk_pop_f',
                   '연령대_10_직장_인구_수': 'wk_pop_10s', '연령대_20_직장_인구_수': 'wk_pop_20s', '연령대_30_직장_인구_수': 'wk_pop_30s', 
                   '연령대_40_직장_인구_수': 'wk_pop_40s', '연령대_50_직장_인구_수': 'wk_pop_50s', '연령대_60_이상_직장_인구_수': 'wk_pop_60s'}
    },
    {
        'file': '서울시 상권분석서비스(소득소비-행정동).csv',
        'rename': {'기준_년분기_코드': 'yq_cd', '행정동_코드': 'dong_cd', '행정동_코드_명': 'dong_nm',
                   '월_평균_소득_금액': 'avg_income', '소득_구간_코드': 'income_lvl',
                   '지출_총금액': 'exp_tot', '식료품_지출_총금액': 'exp_food',
                   '의류_신발_지출_총금액': 'exp_cloth', '생활용품_지출_총금액': 'exp_daily',
                   '의료비_지출_총금액': 'exp_med', '교통_지출_총금액': 'exp_tx',
                   '교육_지출_총금액': 'exp_edu', '유흥_지출_총금액': 'exp_ent',
                   '여가_문화_지출_총금액': 'exp_cltr', '기타_지출_총금액': 'exp_etc', 
                   '음식_지출_총금액': 'exp_dine'}
    },
    {
        'file': '서울시 상권분석서비스(아파트-행정동).csv',
        'rename': {'기준_년분기_코드': 'yq_cd', '행정동_코드': 'dong_cd', '행정동_코드_명': 'dong_nm', 
                   '아파트_단지_수': 'apt_cnt', '아파트_평균_면적': 'apt_avg_area', '아파트_평균_시가': 'apt_avg_price'}
    },
    {
        'file': '서울시 상권분석서비스(집객시설-행정동).csv',
        'rename': {'기준_년분기_코드': 'yq_cd', '행정동_코드': 'dong_cd', '행정동_코드_명': 'dong_nm',
                   '집객시설_수': 'fclty_tot', '관공서_수': 'fclty_gov_cnt', '은행_수': 'fclty_bank_cnt',
                   '종합병원_수': 'fclty_gen_hosp_cnt', '일반_병원_수': 'fclty_hosp_cnt', '약국_수': 'fclty_pharm_cnt',
                   '유치원_수': 'fclty_kind_cnt', '초등학교_수': 'fclty_elem_cnt', '중학교_수': 'fclty_mid_cnt', 
                   '고등학교_수': 'fclty_high_cnt', '대학교_수': 'fclty_univ_cnt', '백화점_수': 'fclty_dept_cnt',
                   '슈퍼마켓_수': 'fclty_super_cnt', '극장_수': 'fclty_thtr_cnt', '숙박_시설_수': 'fclty_accom_cnt',
                   '공항_수': 'fclty_arpt_cnt', '철도_역_수': 'fclty_rail_cnt', '버스_터미널_수': 'fclty_bus_term_cnt',
                   '지하철_역_수': 'fclty_subway_cnt', '버스_정거장_수': 'fclty_bus_stop_cnt'}
    },
    {
        'file': '서울시 상권분석서비스(상권변화지표-행정동).csv',
        'rename': {'기준_년분기_코드': 'yq_cd', '행정동_코드': 'dong_cd', '행정동_코드_명': 'dong_nm',
                   '상권_변화_지표': 'change_idx', '상권_변화_지표_명': 'change_idx_nm', 
                   '운영_영업_개월_평균': 'open_avg_months', '폐업_영업_개월_평균': 'close_avg_months'}
    }
]

# 2-2. 반복문을 돌면서 파일을 하나씩 읽어 마스터에 붙이기
for info in datasets_info:
    file_name = info['file']
    if not os.path.exists(file_name):
        print(f"⚠️ [경고] {file_name} 파일을 찾을 수 없어 건너뜁니다.")
        continue
        
    print(f"[{file_name}] 병합 중...")
    # 공공데이터 인코딩 호환 (cp949 기본, 에러시 utf-8)
    try:
        df_temp = pd.read_csv(file_name, encoding='cp949')
    except UnicodeDecodeError:
        df_temp = pd.read_csv(file_name, encoding='utf-8')
        
    # 컬럼명 변경
    df_temp.rename(columns=info['rename'], inplace=True)
        
    # 딕셔너리에 매핑한 핵심 컬럼들만 남기고 자르기 (데이터가 너무 비대해지는 것 방지)
    use_cols = [col for col in info['rename'].values() if col != 'dong_nm']
    df_temp = df_temp[use_cols]
    
    # 마스터 데이터에 Left Join (yq_cd, dong_cd, dong_nm 기준)
    df_master = pd.merge(df_master, df_temp, on=broad_keys, how='left')

print("\n=== [Step 3] 영역 데이터 결합 (시간 개념이 없는 정적 데이터) ===")
# 영역 데이터는 '분기'가 없으므로 'dong_cd', 'dong_nm'으로 결합
area_file = '서울시 상권분석서비스(영역-행정동).csv'
if os.path.exists(area_file):
    try:
        df_area = pd.read_csv(area_file, encoding='cp949')
    except UnicodeDecodeError:
        df_area = pd.read_csv(area_file, encoding='utf-8')

    df_area.rename(columns={'행정동_코드': 'dong_cd', '행정동_명': 'dong_nm', 
                            '엑스좌표_값': 'coord_x', '와이좌표_값': 'coord_y', '영역_면적': 'dong_area'}, inplace=True)
        
    # ['dong_cd'] 기준으로 Left Join
    df_master = pd.merge(df_master, df_area[['dong_cd', 'coord_x', 'coord_y', 'dong_area']], on=['dong_cd'], how='left')

print("\n=== [Step 4] 파생 변수(구, year, quarter, ds) 추가 및 정렬 ===")

# 4-1. 자치구 매핑 딕셔너리 준비
gu_mapping = {
    '11110': '종로구', '11140': '중구', '11170': '용산구', '11200': '성동구',
    '11215': '광진구', '11230': '동대문구', '11260': '중랑구', '11290': '성북구',
    '11305': '강북구', '11320': '도봉구', '11350': '노원구', '11380': '은평구',
    '11410': '서대문구', '11440': '마포구', '11470': '양천구', '11500': '강서구',
    '11530': '구로구', '11545': '금천구', '11560': '영등포구', '11590': '동작구',
    '11620': '관악구', '11650': '서초구', '11680': '강남구', '11710': '송파구',
    '11740': '강동구'
}

# 4-2. dong_cd를 문자열로 안전하게 변환 후 앞 5자리 추출
df_master['dong_cd'] = df_master['dong_cd'].astype(str)
df_master['gu_cd'] = df_master['dong_cd'].str[:5]
df_master['gu_nm'] = df_master['gu_cd'].map(gu_mapping)

# 4-3. yq_cd를 문자열로 변환 
yq_str = df_master['yq_cd'].astype(str)

# 4-4. year, quarter 추출 (정수형)
df_master['year'] = yq_str.str[:4].astype(int)
df_master['quarter'] = yq_str.str[4:].astype(int)

# 4-5. 시계열 기준일(ds) 생성
df_master['ds'] = pd.to_datetime(yq_str.str[:4] + 'Q' + yq_str.str[4:])

# 4-6. 컬럼 순서 깔끔하게 재배치
# 식별자(Key)들을 맨 앞으로
front_cols = ['ds', 'year', 'quarter', 'yq_cd', 'gu_cd', 'gu_nm', 'dong_cd', 'dong_nm', 'biz_cd', 'biz_nm']
remaining_cols = [c for c in df_master.columns if c not in front_cols]
df_master = df_master[front_cols + remaining_cols]

# 4-7. 결측치 처리를 위한 시계열 완벽 정렬 (행정동 -> 업종 -> 시간 순)
df_master = df_master.sort_values(['dong_cd', 'biz_cd', 'ds']).reset_index(drop=True)

print("\n=== [Step 5] 구조적 결측치(BFill) 보정 ===")

# 5-1. 집객시설 (2020년 4분기 이전 누락 처리)
facility_cols = [col for col in df_master.columns if col.startswith('fclty_')]
if facility_cols:
    df_master[facility_cols] = df_master.groupby('dong_cd')[facility_cols].bfill().fillna(0)

# 5-2. 아파트 (2019년 1~3분기 누락 처리)
apt_cols = [col for col in df_master.columns if col.startswith('apt_')]
if apt_cols:
    df_master[apt_cols] = df_master.groupby('dong_cd')[apt_cols].bfill().fillna(0)

print("\n=== [Step 6] 시계열 정렬 및 최종 마스터 저장 ===")
# 6-1. 전처리를 위한 1차 정렬 (지역 -> 업종 -> 시간)
df_master = df_master.sort_values(['dong_cd', 'biz_cd', 'yq_cd']).reset_index(drop=True)

# 6-2. 저장
df_master.to_csv("seoul_cma_data.csv", index=False, encoding='utf-8-sig')
print(f"최종 마스터 데이터 저장 완료! (Shape: {df_master.shape})")