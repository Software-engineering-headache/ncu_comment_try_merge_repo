from fastapi import FastAPI
from controller.login import router as login_router
from controller.favorite_course import router as favorite_router
from controller.admin_list import router as admin_list_router
from controller.member_list import router as member_list_router
from database.main import router as database_router
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware


from database import models
from database.database import engine




app = FastAPI()

# 添加伺服器端的 SessionMiddleware
app.add_middleware(
    SessionMiddleware,
    secret_key="your_secret_key",  # 替換成你的隨機密鑰
    session_cookie="session",     # 存儲 Session 的 Cookie 名稱
    max_age=3600,                 # Session 有效期（秒）
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5500","http://localhost:5500","http://localhost:5500/interface/ncu_comment-interface/profoile.html"],  # 替換成你的前端來源
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["Authorization", "Content-Type"],
)

# 初始化資料庫
models.Base.metadata.create_all(bind=engine)

# 加載路由
app.include_router(login_router, tags=["Login"])
app.include_router(favorite_router, tags=["Favorite Course"]) 
app.include_router(database_router, tags=["Database"])
app.include_router(admin_list_router, tags=["Admin List"])
app.include_router(member_list_router, tags=["Member List"])


if __name__ == "__main__":
    import uvicorn
    import webbrowser
    url = "http://127.0.0.1:5500/interface/ncu_comment-interface/index.html"
    print(f"後端服務運行中，請訪問 {url}")
    
    # 在瀏覽器中打開指定 URL
    webbrowser.open(url)
    print("後端服務運行中，請訪問 http://127.0.0.1:8000")
    uvicorn.run(app, host="127.0.0.1", port=8000)
