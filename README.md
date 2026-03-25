## 🏙️ 서울 상권 및 업종별 매출 증감률 예측 서비스 (Seoul Commercial District Analysis)

본 프로젝트는 서울시 내 상권(행정동) 및 업종 데이터를 기반으로 다음 분기의 예상 총매출액 증감률(QoQ)을 예측하고, 이를 시각화하여 사용자의 직관적인 비즈니스 의사결정(창업, 투자 등)을 돕는 **지능형 상권 분석 웹 플랫폼**입니다. 단순 수치 예측을 넘어, 실시간 AI 추론 결과와 상세 리포트를 제공하는 All-in-One 시스템을 구축했습니다.

### 🌟 핵심 아키텍처 (Architecture)

본 프로젝트는 데이터 분석 및 AI 추론의 효율성과 프론트엔드의 풍부한 인터랙션을 위해 **React(Frontend) - FastAPI(Backend & AI)** 형태의 분리된 아키텍처로 설계되었습니다.

- **FastAPI (AI & Backend Server):** Raw SQL 기반의 고성능 DB 조회, LightGBM 모델 추론, 상권 진단 텍스트 동적 생성, 그리고 공간 데이터(GeoJSON) 서빙을 비동기로 빠르고 안정적으로 처리합니다.
- **React (Frontend Client):** Leaflet 기반의 인터랙티브 지도와 Nivo 차트를 활용하여 방대한 상권 데이터를 시각적으로 렌더링합니다.

### 🔥 담당 업무 및 핵심 기여 (My Contributions)

데이터 수집 및 모델 최적화부터 고성능 DB 파이프라인 설계 및 백엔드 API 설계, 프론트엔드 시각화까지 전체 시스템의 End-to-End 파이프라인 구축을 담당했습니다.

#### 1. AI & Data Engineering (매출 증감률 예측 모델)

- **다중 분류 앙상블 모델 구축:** 대표 트리 기반 모델(LightGBM, CatBoost)을 TimeSeriesSplit 및 Optuna로 튜닝하여 결합. 최종 **Accuracy 67.2%, Macro F1 0.62** 달성.
- **Data-Centric 최적화 및 OOT 검증:** 정적 데이터는 배제하고 `_MA4`, `_STD4`, `_QoQ` 등 시계열 파생 변수를 집중 설계. 시간축 기준의 엄격한 OOT(Out-Of-Time) 분할로 데이터 누수 원천 차단.
- **SHAP 비즈니스 인사이트 도출:** 예측 판단 근거를 분석하여 '기저효과에 의한 성장형 상권'과 '고물가 저항에 의한 위축형 상권'의 뚜렷한 특징 규명.

#### 2. Backend Engineering (FastAPI & 공간 데이터 처리)

- **Raw SQL 기반 데이터 접근 계층(DAO) 구축:** PyMySQL을 활용하여 ORM의 오버헤드를 줄이고, `dbt_afn.py`, `status_db.py` 등 목적에 맞게 DB 모듈을 철저히 분리.
- **모듈화된 라우터 설계:** `ai.py`(예측), `status.py`(요약), `status_map.py`(공간) 등으로 책임을 분리하여 유지보수성 극대화.
- **DB 단에서의 복잡한 연산 및 최적화:** 서버 메모리 부하를 줄이기 위해 `JOIN`, `GROUP BY`, `CASE WHEN` 구문을 적극 활용. 특히 개·폐업률 조회 시 DB 단에서 예외(0 나누기)를 방어하며 가중 평균(Weighted Average)을 선제적으로 계산하여 반환하도록 쿼리 최적화.
- **안전한 쿼리 설계:** SQL Injection을 방지하기 위한 파라미터화된 쿼리(`%s`) 적용 및 `IntegrityError` 등 DB Connection 예외 처리를 통한 서버 안정성 확보.
- **실시간 상권 진단 리포트 생성 (`report.py`):** AI 모델이 도출한 라벨(0:위축, 1:유지, 2:성장)과 피처 증감률(점포 밀도, 경쟁구조 지수 등)을 결합하여, 프론트엔드에 렌더링될 자연어 형태의 맞춤형 인사이트 리포트를 동적으로 생성하는 로직 구현.
- **GeoJSON 공간 데이터 서빙:** QGIS를 활용해 서울 자치구 폴리곤을 `.geojson` 포맷으로 추출하고, 이를 FastAPI 정적 파일로 서빙하여 프론트엔드 지도 렌더링 리소스 최적화.

#### 3. Frontend Engineering (React + Vite)

- **인터랙티브 Map UI (`SeoulMap.jsx`):** React-Leaflet을 활용해 서울시 구별 GeoJSON 데이터를 렌더링. 마우스 호버 및 클릭 이벤트에 따라 동적으로 상태를 업데이트하는 공간 인터페이스 구현.
- **데이터 시각화 대시보드 (`StatusChart.jsx`, `IndustryChart.jsx` 등):** `@nivo` 라이브러리를 활용해 점포당 매출액(Bar), 5분기 매출 추이(Line), 남녀 유동인구 비율(Custom Layout), 업종 비율(Pie) 등을 밀도 있게 표현하는 반응형 컴포넌트 개발.
<p align="center">
  <img src="https://github.com/user-attachments/assets/3d0f6bea-20ba-4aba-a95e-be99b119c53f" width="45%" alt="서비스화면캡처1">
  <img src="https://github.com/user-attachments/assets/7d099c7b-7c96-4783-b5c0-ae92aa22140a" width="45%" alt="서비스화면캡처2">
</p>

### 📁 디렉토리 구조 (FastAPI 백엔드 중심)

관심사 분리(SoC) 원칙을 적용하여 라우터(API), 모델(AI), 데이터(DB) 계층을 명확히 구분했습니다.

```jsx
📦 project-root
 ┣ 📂 app
 ┃ ┣ 📂 routers              # [Controller] 요청 URL 라우팅 및 응답
 ┃ ┃ ┣ 📜 ai.py              # AI 예측 및 리포트 응답 API
 ┃ ┃ ┣ 📜 status.py          # 자치구 현황(매출/유동인구) API
 ┃ ┃ ┗ 📜 status_map.py      # 지도 공간 데이터 및 구별 상세 통계 API
 ┃ ┣ 📂 model                # [Service] AI 추론 및 비즈니스 로직 연산
 ┃ ┃ ┣ 📜 model.py           # LightGBM 로드(.pkl) 및 스케일링/추론
 ┃ ┃ ┣ 📜 report.py          # 예측 결과 기반 동적 텍스트 리포트 생성
 ┃ ┃ ┗ 📜 status_model.py    # CAGR(연평균성장률) 및 분기별 TOP3 랭킹 산출 로직
 ┃ ┣ 📂 db                   # [DAO] DB Connection 및 Raw SQL 쿼리 처리
 ┃ ┃ ┣ 📜 dbt_afn.py         # AI 입력용 피처 다중 JOIN 조회 로직
 ┃ ┃ ┣ 📜 status_db.py       # 자치구별 매출/점포/유동인구 단순 집계 쿼리
 ┃ ┃ ┗ 📜 status_map_db.py   # 가중평균 및 복잡한 조건식(CASE WHEN) 포함 쿼리
 ┃ ┗ 📂 static
 ┃   ┗ 📂 file
 ┃     ┗ 📜 seoul_gu.geojson # QGIS 추출 자치구 폴리곤 데이터
 ┣ 📜 main.py                # [Entry Point] FastAPI 애플리케이션 실행
 ┣ 📜 requirements.txt       # 의존성 관리
 ┗ 📜 .env                   # DB 인증 및 환경변수
```

### 🔄 핵심 데이터 흐름 (Data Flow)

사용자의 지도 클릭부터 최종 AI 리포트 출력까지의 파이프라인은 다음과 같이 동작합니다.

1. **Request:** 사용자가 프론트엔드(`SeoulMap.jsx`)에서 특정 구/동/업종을 선택하여 `/ai` 엔드포인트로 요청 전송.
2. **Multi-Step DB Fetch (`dbt_afn.py`):** * `dong_code_master` 테이블에서 구/동 명칭으로 행정동 코드(dcm_code) 조회.
    - `svc_industry_code` 테이블에서 업종명으로 업종 코드(sic_code) 조회.
    - 위에서 획득한 두 식별자를 통해 `ai_feature_name` 테이블에서 24개의 ML 피처 데이터를 단일 Row로 신속하게 로드.
3. **ML Inference (`model.py`):** 로드된 피처(`feature_row`)를 전처리된 LightGBM 모델 객체(`lgb_model`)에 주입하여 다음 분기 성장/유지/위축 여부(Label 0~2) 추론.
4. **Report Generation (`report.py`):** 예측된 라벨과 상권의 주요 지표(매출, 점포 밀도 등) 증감률을 분석하여 맞춤형 텍스트 리포트(HTML 포맷 포함) 생성.
5. **Response & Render:** 최종 예측 결과와 리포트가 클라이언트로 반환되며, 프론트엔드는 이를 Nivo 차트 및 요약 패널(`GuInfoPanel.jsx`)에 동적으로 렌더링.

### 🛠 Tech Stack

- **Machine Learning & Data Analysis**
    - **Algorithms:** LightGBM, CatBoost, Scikit-learn
    - **XAI & Tuning:** SHAP, Optuna
    - **Data Processing:** Pandas, NumPy, Joblib (모델 직렬화/역직렬화)
- **Backend & Database**
    - **Framework:** Python, FastAPI, Uvicorn
    - **Database & ORM:** MySQL, PyMySQL (Raw SQL 기반 데이터 접근 및 가중평균/예외처리 쿼리 최적화)
- **Frontend & Visualization**
    - **Framework:** React, Vite
    - **UI/UX Component:** Material-UI (MUI)
    - **Data Visualization:** @nivo (Bar, Line, Pie 반응형 차트), React-Leaflet (인터랙티브 맵)
- **GIS & Spatial Data**
    - **Tools:** QGIS, GeoJSON (서울시 자치구 폴리곤 데이터 추출 및 서빙)

---

## 📊  [데이터 분석 리포트] 머신러닝 기반 서울시 상권 변동성 예측 및 신규 출점 추천 모델 구축

### 💡 Project Overview

본 프로젝트는 서울시 내 상권(행정동) 및 업종 데이터를 기반으로 **다음 분기의 예상 총매출액 증감률(QoQ)을 예측하는 머신러닝 파이프라인**입니다. 단순한 매출액 회귀 예측을 넘어, 실제 비즈니스 환경에서 직관적으로 활용할 수 있도록 매출 변동성을 3단계(위축/유지/성장)로 범주화하여 다중 분류(Multi-class Classification) 모델을 구축했습니다.

### 🗂 Data Source

본 프로젝트는 공공 데이터를 가공하여 상권의 매출 및 소비 패턴을 도출했습니다.

- **서울시 열린데이터광장 (Seoul Open Data Plaza):**
    - 서울시 상권분석서비스 (상권-추정매출, 상권-생활인구, 상권-점포 등)
    - 법정동 및 행정동 맵핑 데이터

### 🎯 Target Definition

실제 상권 매출의 변동성을 현실적으로 반영하기 위해, 다음 분기 총매출액 증감률(QoQ)을 기준으로 타겟 변수를 설계했습니다.

- **Class 0 (위축):** 매출 증감률 -20% 미만 (`< -0.2`)
- **Class 1 (유지):** 매출 증감률 -20% 이상 ~ 20% 이하 (`0.2 <= x <= 0.2`)
- **Class 2 (성장):** 매출 증감률 20% 초과 (`> 0.2`)

### 🔑 Key Features (핵심 피처 엔지니어링)

- **"정적인 데이터는 변동성을 예측할 수 없다"**는 가설 아래, 정적 데이터(하위 20%)를 제거하고 시계열 동적 파생 변수를 대거 추가하여 모델의 예측력을 극대화했습니다.
- **Trend & Volatility (시계열 추세 및 변동성):**
    - `_QoQ`: 직전 분기 대비 증감률 (단기 모멘텀 지표)
    - `MA_2` / `STD_2`: 최근 6개월 이동평균 및 표준편차 (단기 추세 및 급격한 변화 감지)
    - `MA_4` / `STD_4`: 최근 1년 이동평균 및 표준편차 (장기 펀더멘털 및 계절성 반영)
- **Demographic & Time Consumption (소비 패턴 집중도):**
    - `저녁 매출 비율`, `오후 매출 비율`, `3050세대 매출 비율` (상권의 체질을 결정하는 핵심 지표)
- **Base Metrics (상권 기초 체력):**
    - `prev_qs_total_log` (직전 분기 총매출), `prev_ATV` (객단가), `prev_sales_per_store` (점포당 매출)

### 🛠 Validation Strategy: OOT (Out-Of-Time) Split

과거 데이터로 미래를 예측하는 시계열적 특성을 반영하고, Data Leakage(데이터 누수) 및 과적합을 방지하기 위해 엄격한 **OOT 데이터 분할 전략**을 채택했습니다.

- **분할 기준:** 시간축(Year-Quarter Code, `yqc_cd`) 기준 동적 분할 적용
- **Train Set:** 과거 ~ (최신 기준 - 2분기) 데이터로 모델 학습
- **Validation Set:** (최신 기준 - 1분기) 데이터로 하이퍼파라미터 튜닝 및 검증
- **Test Set:** 가장 최신 분기 데이터로 최종 모델 성능 평가 및 실무 환경 시뮬레이션

### ⚙️ Modeling & Performance

- **Algorithm:** **LightGBM**과 **CatBoost** 모델을 개별적으로 Optuna/GridSearch를 통해 튜닝한 후, 수학적 앙상블(Ensemble) 기법을 적용하여 예측 안정성을 높였습니다.
- **Final Evaluation Metrics (OOT Test Set 기준):**
    - **Accuracy (정확도): 0.6718 (67.2%)**
    - **Macro F1-Score: 0.6205** (미래 시점의 3진 분류 환경에서 유의미한 예측 방어력 확보)

### 🔍 Explainable AI (XAI) & Business Insights

**SHAP (SHapley Additive exPlanations)** 분석을 도입하여 단순 예측을 넘어, 상권이 왜 위축되거나 성장하는지에 대한 핵심 요인을 도출했습니다.

<img height="300" alt="image" src="https://github.com/user-attachments/assets/d3fa2e25-a560-443b-96b9-6eac1339aedd" />
<img height="300" alt="image" src="https://github.com/user-attachments/assets/67614324-8de9-482b-86fc-965dd2768b9c" />

- **성장형 상권의 조건 (기저효과 반등):** 맹목적인 우상향이 아닌, 장기적인 체력(`MA4` 높음)은 튼튼하지만 직전 분기에 일시적인 조정을 받아(`QoQ` 낮음) 반등이 예상되는 상권. 낮 시간대 대중적 소비 패턴을 보임.
- **위축형 상권의 경고 (거품 붕괴와 고물가 저항):** 장기 기초 체력이 약한데(`MA4` 낮음) 직전 분기에 매출이 반짝 급등했거나(`QoQ` 높음), 타 상권 대비 단가가 빠르게 상승하여(`ATV` 상승) 소비자의 외면을 받는 상권.
