# db_connection.py
import pymysql
from dotenv import load_dotenv
import os

# -------------------------
# Load .env
# -------------------------
load_dotenv()

# MySQL 설정
MYSQL_HOST = os.getenv("MYSQL_HOST", "mysql")
MYSQL_URL = os.getenv("MYSQL_URL", "localhost")
MYSQL_INTERNAL_PORT = 3306
MYSQL_EXTERNAL_PORT = int(os.getenv("MYSQL_PORT", 3308))
MYSQL_USER = os.getenv("MYSQL_USER", "myuser")
MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD", "myuser1234")
MYSQL_DATABASE = os.getenv("MYSQL_DATABASE", "startupdb")
DEFAULT_HOST_TYPE = os.getenv("MYSQL_HOST_TYPE", "internal")  # internal 또는 external

# -------------------------
# DB 연결 함수
# -------------------------
def get_connection():
    host_type = DEFAULT_HOST_TYPE
    if host_type == "internal":
        host = MYSQL_HOST
        port = MYSQL_INTERNAL_PORT
    else:
        host = MYSQL_URL
        port = MYSQL_EXTERNAL_PORT

    return pymysql.connect(
        host=host,
        port=int(port),
        user='root',
        passwd='root1234',
        db=MYSQL_DATABASE,
        # charset="utf8"
    )


if __name__ == "__main__":
    print(get_connection())