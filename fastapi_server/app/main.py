from fastapi import FastAPI
# import redis.asyncio as redis
import os
from fastapi.staticfiles import StaticFiles
from starlette.requests import Request
from fastapi.templating import Jinja2Templates
from starlette.responses import HTMLResponse, RedirectResponse
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from routes.ai import router as ai_router
from routes.gu import router as gu_router
from routes.category import router as category_router
from routes.result import router as result_router
from routes.status import router as status_router
from routes.status_map import router as status_map_router
from routes.board import router as board_router
from dotenv import load_dotenv

# .env 파일 로드
load_dotenv()

app = FastAPI()

# -----------------------
# CORS 설정
# -----------------------
# .env에서 읽어서 리스트 형태로 변환
origins = os.getenv("CORS_ORIGINS", "").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# 정적 파일 제공 (CSS/JS/이미지)
app.mount("/static", StaticFiles(directory="static"), name="static")
app.mount("/assets", StaticFiles(directory="static/assets"), name="assets")
app.mount("/src", StaticFiles(directory="static/src"), name="src")

app.include_router(ai_router, prefix="/ai", tags=["AI"])
app.include_router(gu_router, prefix="/gu", tags=["GU"])
app.include_router(category_router, prefix="/category", tags=["Category"])
app.include_router(result_router, prefix="/result", tags=["Result"])
app.include_router(status_router, prefix="/status", tags=["Status"])
app.include_router(status_map_router, prefix="/status_map", tags=["StatusMap"])
app.include_router(board_router, prefix="/board", tags=["Board"])
# app.include_router(write_router, prefix="/write", tags)


templates = Jinja2Templates(directory="templates")
@app.get("/")
def root(request: Request):
    return templates.TemplateResponse("index4.html", {"request": request})

@app.get("/.well-known/appspecific/com.chrome.devtools.json")
async def chrome_devtools_config():
    return JSONResponse(
        content={
            "Browser": "FastAPI-DevTools/1.0",
            "Protocol-Version": "1.3",
            "User-Agent": "FastAPI Server",
            "V8-Version": "0.0",
            "WebKit-Version": "0.0",
            "webSocketDebuggerUrl": "ws://127.0.0.1:8001/devtools",
            "targets": [
                {
                    "description": "FastAPI Debug Target",
                    "devtoolsFrontendUrl": "chrome-devtools://devtools/bundled/inspector.html",
                    "id": "fastapi-debug-1",
                    "title": "FastAPI App",
                    "type": "page",
                    "url": "http://localhost:8001",
                    "webSocketDebuggerUrl": "ws://127.0.0.1:8001/devtools/page/fastapi-debug-1"
                }
            ]
        }
    )

