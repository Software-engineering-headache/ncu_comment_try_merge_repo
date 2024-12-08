from fastapi import FastAPI
from controller.login import router as login_router
from database.main import router as database_router
# from preprocess_api import router as preprocess_router
# from get_comment_classes_api import router as comment_classes_router
from database import models
from database.database import engine

app = FastAPI()

# 初始化資料庫
models.Base.metadata.create_all(bind=engine)

# 加載路由
app.include_router(login_router, tags=["Login"])
app.include_router(database_router, tags=["Database"])
# app.include_router(preprocess_router, prefix="/preprocess", tags=["Preprocess"])
# app.include_router(comment_classes_router, prefix="/comment-classes", tags=["Comment Classes"])

if __name__ == "__main__":
    import uvicorn
    import webbrowser
    url = "http://127.0.0.1:5500/interface/ncu_comment-interface/index.html"
    print(f"後端服務運行中，請訪問 {url}")
    
    # 在瀏覽器中打開指定 URL
    webbrowser.open(url)
    print("後端服務運行中，請訪問 http://127.0.0.1:8000")
    uvicorn.run(app, host="0.0.0.0", port=8000)