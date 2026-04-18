### 1. 데이터 개요 및 타겟(Target) 변수 설정

**1.1. 시계열 패널 데이터 구조 분석**

- 전체 상권-업종 조합 수는 19,018개이며, 총 24개 분기가 모두 존재하는 조합의 비율은 74.66%로 패널 데이터의 연속성이 양호하게 확보됨.
- 2019-2020년 코로나19로 인한 매출 하락 구간이 존재하나, 전체 기간 추세는 우상향 경향을 보임.

<img width="1390" height="590" alt="Image" src="https://github.com/user-attachments/assets/1bd82510-0488-45e4-b5c9-dfbebdd97f72" />

<br>

**1.2. 타겟 변수 라벨링 및 클래스 불균형 통제**

- **증감률 기준 설정:** 단순 연속형 매출액을 예측하는 대신, 비즈니스 목적에 맞게 전분기 대비 매출 증감률을 산출하여 3개의 범주(위축, 유지, 성장)로 분류함.
- **클래스 불균형 방지:** 타겟 기준선을 임의로 치우치게(예: 0, 0.25) 설정할 경우 발생하는 클래스 불균형(Class Imbalance) 문제를 방지하기 위해, 전체 증감률 분포를 고려하여 `[-0.2, 0.2]`를 임계값으로 설정함. 이를 통해 모델이 특정 클래스 예측을 포기하는 현상을 차단함.

<img width="1189" height="590" alt="Image" src="https://github.com/user-attachments/assets/602a954f-3820-421e-9e8f-4ec6228413f2" />

<br>

**1.3. 데이터 누수(Data Leakage) 방지**

- 상권별, 업종별, 시간순으로 데이터를 정렬한 뒤 `shift(1)` 연산을 적용함.
- 예측하고자 하는 정답(`target`)은 t시점(예: 2분기)의 결과값으로 두고, 모델이 학습하는 입력 피처(`prev_`)는 모두 t-1시점(예: 1분기 이전)의 데이터로 구성하여 실전 예측 환경과 동일한 구조를 완성함.

---

### 2. 비즈니스 로직 기반 파생 변수(Feature Engineering) 생성

단순 수치를 넘어 상권의 효율성, 소비 패턴, 단기 모멘텀을 설명하는 파생 변수를 생성함.

- **기본 스케일 조정:** 절대 규모가 큰 지표(총매출액, 유동인구, 아파트 가격 등)는 로그 변환(`log1p`)을 통해 정규성을 확보함.
- **상권 경쟁력 및 효율 지표:** 상권 내 개별 점포의 체력을 보여주는 점포당 매출(`sales_per_store`), 상권의 소비력을 보여주는 객단가(`ATV`), 상권 밀집도를 나타내는 점포 밀도(`store_density`)를 도출함.
- **소비 패턴 세분화(Ratio):** 전체 매출 대비 특정 시간대(점심/오후/저녁/심야), 요일(주중/주말), 주요 연령대(2030, 3050, 60대)의 매출 비중을 계산하여 상권의 질적 특성을 반영함.
- **시계열 파생 변수:** 핵심 KPI 5종(총매출, 점포당 매출, 객단가, 유동인구, 점포 밀도)에 대하여 단기 모멘텀 지표인 2분기 이동평균(`MA2`), 표준편차(`STD2`), 전분기 대비 증감률(`QoQ`)을 산출함.
- **클러스터링:** 비율 데이터를 활용해 K-Means 알고리즘으로 상권 특성을 4개 군집으로 분류(`cluster_id`)하여 범주형 피처로 추가함.

**상권 특성 클러스터링 (K-Means)**
| cluster_id | sales_weekdays_ratio | sales_weekend_ratio | sales_lunch_ratio | sales_evening_ratio | sales_night_ratio | sales_2030_ratio | sales_3050_ratio |
|---|---|---|---|---|---|---|---|
| 0 | 0.918 | 0.082 | 0.129 | 0.442 | 0.047 | 0.259 | 0.807 |
| 1 | 0.659 | 0.341 | 0.250 | 0.347 | 0.050 | 0.314 | 0.634 |
| 2 | 0.687 | 0.313 | 0.070 | 0.327 | 0.320 | 0.412 | 0.614 |
| 3 | 0.870 | 0.130 | 0.340 | 0.177 | 0.012 | 0.181 | 0.516 |

---

### 3. 탐색적 가설 검정 (Filter Method 변수 선택)

생성된 피처들이 타겟(성장/유지/위축)을 분류하는 데 통계적으로 유의미한지 확인하기 위해 1차 필터링을 수행함.

- **연속형 변수 (ANOVA 검정):** 각 변수별로 상권 3개 그룹 간 평균 차이를 분석함. 매출 규모, 밀도, 시계열 모멘텀 지표 등 대부분의 수치형 변수가 p-value < 0.05로 나타나 모델 학습에 유의미한 것으로 판별됨.
- **범주형 변수 (Chi-Square 검정):** 클러스터 ID(`cluster_id`)는 타겟과 강한 연관성을 보였으나, **대학가 여부(`is_univ`)는 p-value 0.3471을 기록하여 상권의 성장을 설명하는 데 통계적 근거가 없음이 입증됨.** 이에 따라 해당 변수를 최종 모델 학습에서 제외함.

<details>
<summary>피처별 가설 검정 결과 </summary>

  | Feature | Type | p-value | Significant
-- | -- | -- | -- | --
0 | cluster_id | Categorical (Chi-Square) | 0 | TRUE
1 | qs_total_log | Numeric (ANOVA) | 0 | TRUE
2 | fp_total_log | Numeric (ANOVA) | 0 | TRUE
3 | wp_total_log | Numeric (ANOVA) | 0 | TRUE
4 | rp_total_log | Numeric (ANOVA) | 0 | TRUE
5 | apt_price_log | Numeric (ANOVA) | 0 | TRUE
6 | sales_per_store | Numeric (ANOVA) | 0 | TRUE
7 | store_density | Numeric (ANOVA) | 0 | TRUE
8 | ATV | Numeric (ANOVA) | 0 | TRUE
9 | sales_weekdays_ratio | Numeric (ANOVA) | 0 | TRUE
10 | sales_weekend_ratio | Numeric (ANOVA) | 0 | TRUE
11 | sales_lunch_ratio | Numeric (ANOVA) | 0 | TRUE
12 | sales_afternoon_ratio | Numeric (ANOVA) | 0 | TRUE
13 | sales_evening_ratio | Numeric (ANOVA) | 0 | TRUE
14 | sales_night_ratio | Numeric (ANOVA) | 0 | TRUE
15 | sales_2030_ratio | Numeric (ANOVA) | 0 | TRUE
16 | sales_3050_ratio | Numeric (ANOVA) | 0 | TRUE
17 | sales_60_ratio | Numeric (ANOVA) | 0 | TRUE
18 | edu_cnt | Numeric (ANOVA) | 0 | TRUE
19 | traffic_score | Numeric (ANOVA) | 0 | TRUE
20 | qs_total_log_MA2 | Numeric (ANOVA) | 0 | TRUE
21 | qs_total_log_STD2 | Numeric (ANOVA) | 0 | TRUE
22 | qs_total_log_MA4 | Numeric (ANOVA) | 0 | TRUE
23 | qs_total_log_STD4 | Numeric (ANOVA) | 0 | TRUE
24 | qs_total_log_QoQ | Numeric (ANOVA) | 0 | TRUE
25 | sales_per_store_MA2 | Numeric (ANOVA) | 0 | TRUE
26 | sales_per_store_STD2 | Numeric (ANOVA) | 0 | TRUE
27 | sales_per_store_MA4 | Numeric (ANOVA) | 0 | TRUE
28 | sales_per_store_STD4 | Numeric (ANOVA) | 0 | TRUE
29 | ATV_MA2 | Numeric (ANOVA) | 0 | TRUE
30 | ATV_STD2 | Numeric (ANOVA) | 0 | TRUE
31 | ATV_MA4 | Numeric (ANOVA) | 0 | TRUE
32 | ATV_STD4 | Numeric (ANOVA) | 0 | TRUE
33 | ATV_QoQ | Numeric (ANOVA) | 0.0021 | TRUE
34 | fp_total_log_MA2 | Numeric (ANOVA) | 0 | TRUE
35 | fp_total_log_STD2 | Numeric (ANOVA) | 0 | TRUE
36 | fp_total_log_MA4 | Numeric (ANOVA) | 0 | TRUE
37 | fp_total_log_STD4 | Numeric (ANOVA) | 0 | TRUE
38 | fp_total_log_QoQ | Numeric (ANOVA) | 0 | TRUE
39 | store_density_MA2 | Numeric (ANOVA) | 0 | TRUE
40 | store_density_STD2 | Numeric (ANOVA) | 0 | TRUE
41 | store_density_MA4 | Numeric (ANOVA) | 0 | TRUE
42 | store_density_STD4 | Numeric (ANOVA) | 0 | TRUE
43 | store_density_QoQ | Numeric (ANOVA) | 0 | TRUE
44 | is_univ | Categorical (Chi-Square) | 0.3471 | FALSE
45 | sales_per_store_QoQ | Numeric (ANOVA) | 0.0668 | FALSE

</details>

---

### 4. 다중공선성(VIF) 진단 및 3단계 최적화

ANOVA를 통과한 유의미한 변수들을 대상으로 다중공선성을 제거하여 모델의 해석력(SHAP)을 극대화함. 변수 제거는 VIF가 10 미만이 될 때까지 3단계에 걸쳐 논리적으로 진행됨.

**[1단계] 더미 변수의 함정(완전 공선성) 제거**

- **이슈:** 주중/주말 비중 합이 1이 되어 서로를 완벽히 설명함 (VIF 4,408,090 수준 폭발).
- **조치:** 합이 100%가 되는 비율 변수 그룹에서 주중 비중 등 한 축을 제거하여 독립성을 확보함.

**[2단계] 시계열 파생 변수 내 계절성 중복 제거**

- **이슈:** 분기 정보(`quarter`)가 존재하는 상황에서 4분기 이동평균(`MA4`, `STD4`)이 포함되어 모델에 불필요한 과거 가중치와 노이즈가 발생함 (VIF 최대 252,835).
- **조치:** 1년 단위의 장기 지표인 `MA4`, `STD4`를 일괄 삭제하고, 최근 6개월의 단기 트렌드를 예민하게 반영하는 `MA2`로 모멘텀 지표를 통일함.

**[3단계] 정적 수치(원본) vs 동적 수치(이동평균)의 충돌 해결**

- **이슈:** 전분기의 단순 원본 값(`prev_fp_total_log`)과 2분기 평균(`prev_fp_total_log_MA2`)이 동일한 정보를 공유하며 내부 경합을 벌임 (VIF 최대 252,056).
- **조치:** 상권 예측에 있어 과거 특정 시점의 정적 데이터보다 최신 추세가 중요하므로, 5개 핵심 KPI의 '단순 원본 피처'를 모두 삭제함.

**[최종 결과]**
3단계 최적화 결과, 모델에 투입될 모든 변수의 **최대 VIF 지수가 2.96 이하로 하락**함. 이는 변수 간 상호 간섭이 완전히 통제된 '청정 데이터셋'이 구축되었음을 의미함.

---

### 5. 결론

본 데이터 전처리 과정을 통해 시계열 데이터 누수를 원천 차단하였으며, 통계적 가설 검정과 철저한 VIF 진단을 거쳐 노이즈가 제거된 최적의 피처(Feature) 조합을 도출함.

최종 선별된 20여 개의 독립 변수(최근 6개월 이동평균 지표, 전분기 증감률, 상권 특성 세부 비율 지표 등)는 다중공선성 문제없이 LightGBM 등 트리 기반 다중 분류 모델에 즉시 투입될 수 있으며, 학습 이후 수행될 SHAP 분석에서도 훼손되지 않은 명확한 비즈니스 설명력을 제공할 수 있게 됨.
