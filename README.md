## 🏙️ 서울 상권 및 업종별 매출 증감률 예측 서비스 (Seoul Commercial District Analysis)

본 프로젝트는 서울시 내 상권(행정동) 및 업종 데이터를 기반으로 다음 분기의 예상 총매출액 증감률(QoQ)을 예측하고, 이를 시각화하여 사용자의 직관적인 비즈니스 의사결정(창업, 투자 등)을 돕는 **지능형 상권 분석 웹 플랫폼**입니다. 단순 수치 예측을 넘어, 실시간 AI 추론 결과와 상세 리포트를 제공하는 All-in-One 시스템을 구축했습니다.

### 🌟 핵심 아키텍처 (Architecture)

본 프로젝트는 데이터 분석 및 AI 추론의 효율성과 프론트엔드의 풍부한 인터랙션을 위해 **React(Frontend) - FastAPI(Backend & AI)** 형태의 분리된 아키텍처로 설계되었습니다.

- **FastAPI (AI & Backend Server):** Raw SQL 기반의 고성능 DB 조회, LightGBM 모델 추론, 상권 진단 텍스트 동적 생성, 그리고 공간 데이터(GeoJSON) 서빙을 비동기로 빠르고 안정적으로 처리합니다.
- **React (Frontend Client):** Leaflet 기반의 인터랙티브 지도와 Nivo 차트를 활용하여 방대한 상권 데이터를 시각적으로 렌더링합니다.

### 🔥 담당 업무 및 핵심 기여 (My Contributions)

데이터 수집 및 모델 최적화부터 고성능 DB 파이프라인 설계 및 백엔드 API 설계, 프론트엔드 시각화까지 전체 시스템의 End-to-End 파이프라인 구축을 담당했습니다.

#### 1. AI & Data Engineering (상권 변동성 다중 분류 예측 모델)

- **가설 검정 및 다중공선성(VIF) 최적화:** ANOVA/Chi-Square 검정으로 무의미한 정적 변수를 배제하고, VIF 진단을 통해 시계열/비율 변수의 다중공선성을 제거하여 모델의 신뢰도와 설명력을 극대화함.
- **Data-Centric 시계열 모델링(OOT):** 과거 데이터가 미래를 참조하지 못하도록 3-Fold TimeSeriesSplit 및 엄격한 OOT 분할을 적용. 클래스 불균형을 통제한 LightGBM-CatBoost 앙상블을 구축하여 핵심 타겟인 '성장형' 상권에 대해 실무 유효 수준의 **재현율(Recall) 0.63** 및 **Multi-class ROC-AUC 0.80**을 달성함.
- **XAI(SHAP) 및 군집 분석 기반 인사이트 도출:** SHAP을 통해 매출 변동성의 동인을 투명하게 해석하고, 군집 분석을 통해 상권의 소비 성격에 따른 모델의 한계점과 적용 가이드라인을 제시함.

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

데이터 분석 페이지: <https://github.com/mic006016/seoul-commercial-district-analysis/tree/main/docs>
