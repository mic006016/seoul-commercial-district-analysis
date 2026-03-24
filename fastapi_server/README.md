이 문서는 FastAPI 서버를 MySQL, Redis와 함께 Docker로 실행하고  
Python 3.12.10 로컬 개발환경에서도 사용할 수 있도록 구성하는 방법을 안내합니다.

---

## 📌 vccode debuge 세팅에 대해서

✅ Dockerfile, docker-compose.yml - 디버그로 사용되는 파일입니다.

✅ 디버그 없이 사용하기 위해서는 : 기존 Dockerfile, docker-compose.yml 을 -> Dockerfile_debugback, docker-compose.yml_debugback 로 변경 후

✅ Dockerfile_backup, docker-compose.yml_back 를 Dockerfile, docker-compose.yml 변경하고 docker compose를 실행하면 된다.

## 📌 1. 실행 방법

📌 윈도우 환경이면 Docker Desktop이 실행 되어있어야 한다.

### 🐳 Docker Compose 실행

```bash
docker-compose up --build
🚀 demon 실행
docker-compose up --build -d
docker-compose down
🚀 FastAPI 서버 접속

FastAPI:
👉 http://localhost:8000

Swagger UI:
👉 http://localhost:8000/docs

🗄️ MySQL 접속 정보

Host: localhost

Port: 3306

🔧 Redis 접속 정보

Host: localhost

Port: 6379

📌 2. 로컬(호스트) Python 3.12.10 가상환경

Docker 컨테이너 외에도 로컬 환경에서 직접 FastAPI 실행이 가능합니다.

🔧 Python 가상환경 생성
python -m venv venv

Windows
venv\Scripts\activate

패키지 설치
pip install -r app/requirements.txt

리눅스 실행
uvicorn main:app --host 0.0.0.0 --port 8001

윈도우 cmd 실행
uvicorn main:app --host 0.0.0.0 --port 8001

📌 3. 구성 완료 (Features)

이 프로젝트에는 아래 요소가 포함됩니다:

✅ FastAPI 개발 서버 (Python 3.12.10)

✅ MySQL 8.0.44

✅ Redis 7.2

✅ Docker 기반 개발 환경

✅ .env 환경변수 관리

✅ DB 및 Redis 연결 테스트 API 포함

📌 4. env 파일 설정

✅ .env_backup 을 복사해서 .env파일로 만든다.

✅ mysql, redis 파일 경로를 PC 환경에 맞게 주정 : GIT_PATH=D:/_startupproject/StartupServer

✅ docker compose 로 docker 를 구성한다.


📌 5. db 파일 : startupdb 데이터베이스 파일 자동 인식하기 위한 내용

✅ _data/mysql/ 폴더 밑에 있는 잘라내서 다른 곳에 저장한다.
ibdata1
undo_001
undo_002
ibtmp1
startupdb/ 폴더 내 전체 파일 table를 생성하면 이곳에 파일이 생긴다.

✅ docker compose 명령으로 컨테이너 생성

✅ 다른곳에 저장했던 파일들을 _data/mysql/ 폴더 밑에 덮어쓴다.


📌 6. db 파일 import
🚀
mysql.exe -h 127.0.0.1 -P 3308 -u root -p startupdb < "D:\_StartupProject\StartupServer\_dbtablesql\startupdb_age_gender_sales.sql"
🚀
mysql.exe -h 127.0.0.1 -P 3308 -u root -p startupdb < "D:\_StartupProject\StartupServer\_dbtablesql\startupdb_ai_suggest_result.sql"
🚀
mysql.exe -h 127.0.0.1 -P 3308 -u root -p startupdb < "D:\_StartupProject\StartupServer\_dbtablesql\startupdb_commercial_area_infra.sql"
🚀
mysql.exe -h 127.0.0.1 -P 3308 -u root -p startupdb < "D:\_StartupProject\StartupServer\_dbtablesql\startupdb_dong_code_master.sql"
🚀
mysql.exe -h 127.0.0.1 -P 3308 -u root -p startupdb < "D:\_StartupProject\StartupServer\_dbtablesql\startupdb_float_populat.sql"
🚀
mysql.exe -h 127.0.0.1 -P 3308 -u root -p startupdb < "D:\_StartupProject\StartupServer\_dbtablesql\startupdb_quarter_sales.sql"
🚀
mysql.exe -h 127.0.0.1 -P 3308 -u root -p startupdb < "D:\_StartupProject\StartupServer\_dbtablesql\startupdb_store_status_info.sql"
🚀
mysql.exe -h 127.0.0.1 -P 3308 -u root -p startupdb < "D:\_StartupProject\StartupServer\_dbtablesql\startupdb_svc_industry_code.sql"
🚀
mysql.exe -h 127.0.0.1 -P 3308 -u root -p startupdb < "D:\_StartupProject\StartupServer\_dbtablesql\startupdb_year_quarter_code.sql"

🚀 bat 파일로 import
 - import_startupdb.bat
 - 파일 위치 수정
 - create_startupdb.sql를 같이 넣을 지 결정ㅜㅜ

🚀 mysql 암호화 그냥 입력으로 쓰겠다 패키지 설치
 cryptography

📌 6. ERROR exporting to image => 캐시 때문에 COPY 단계가 잘못된 상태에서 계속 재사용 가능성
 docker build --no-cache -t myfastapi .


```
