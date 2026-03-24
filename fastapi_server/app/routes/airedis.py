# redis_client.py
import os
import redis
from dotenv import load_dotenv

load_dotenv()

REDIS_URL = os.getenv("REDIS_URL", None)
REDIS_HOST = os.getenv("REDIS_HOST", "redis")

# Redis 연결 설정
if REDIS_URL:
    redis_client = redis.Redis.from_url(REDIS_URL, decode_responses=True)
else:
    redis_client = redis.Redis(
        host=REDIS_HOST,
        port=6379,
        decode_responses=True
    )


# --------------------
# Redis SET 함수
# --------------------
def redis_set(key: str, value: str):
    return redis_client.set(key, value)


# --------------------
# Redis GET 함수
# --------------------
def redis_get(key: str):
    return redis_client.get(key)
