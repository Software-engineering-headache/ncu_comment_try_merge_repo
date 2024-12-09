from fastapi import FastAPI
from controller.login import router as login_router
from controller.favorite_course import router as favorite_router
from controller.admin_list import router as admin_list_router
from database.main import router as database_router
from fastapi.middleware.cors import CORSMiddleware

from database import models
from database.database import engine

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 或指定來源，例如 "http://127.0.0.1:5500"
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 初始化資料庫
models.Base.metadata.create_all(bind=engine)

# 加載路由
app.include_router(login_router, tags=["Login"])
app.include_router(favorite_router, tags=["Favorite Course"]) 
app.include_router(database_router, tags=["Database"])
app.include_router(admin_list_router, tags=["Admin List"])


if __name__ == "__main__":
    import uvicorn
    import webbrowser
    url = "http://127.0.0.1:5500/interface/ncu_comment-interface/index.html"
    print(f"後端服務運行中，請訪問 {url}")
    
    # 在瀏覽器中打開指定 URL
    webbrowser.open(url)
    print("後端服務運行中，請訪問 http://127.0.0.1:8000")
    uvicorn.run(app, host="127.0.0.1", port=8000)
