import uvicorn
from fastapi import FastAPI, HTTPException, Depends, status
from pydantic import BaseModel
from typing_extensions import Annotated
import models
from database import engine, SessionLocal
from sqlalchemy.orm import Session

app = FastAPI()
# 創建所有與資料庫模型對應的表格
# models.Base.metadata.create_all(bind=engine) 會檢查定義的 SQLAlchemy 模型
# 如果表格不存在，會在資料庫中創建這些表
models.Base.metadata.create_all(bind=engine)


# 定義資料模型，這些是用於處理 API 請求和響應的數據結構
class PostBase(BaseModel):
    title: str
    content: str
    user_id: int

class UserBase(BaseModel):
    username: str

class CommentBase(BaseModel):
    score: int
    content: str



# 這是用於獲取資料庫連接的依賴函數
def get_db():
    db = SessionLocal()  # 建立一個資料庫連接
    try:
        yield db # 使用 yield 將資料庫連接傳遞出去
    finally:
        db.close() # 請求結束後關閉資料庫連接，釋放資源

# 定義資料庫依賴項，這是一種簡化型別註解的方式
db_dependency = Annotated[Session, Depends(get_db)]

# write a comment
@app.post("/comments/", status_code=status.HTTP_201_CREATED)
async def create_comment(comment: CommentBase, db: db_dependency):
    # 根據請求資料創建一個新的comment
    db_comment = models.Comment(**comment.dict()) # comment.dict() 會將 Pydantic 模型轉換為字典
    db.add(db_comment) # 將新comment加入資料庫會話
    db.commit() # 提交更改保存到資料庫

# read a comment
@app.get("/comments/{comment_id}", status_code=status.HTTP_200_OK)
async def read_comment(comment_id: int, db: db_dependency):
    # 從資料庫查找對應 ID 的comment
    comment = db.query(models.Comment).filter(models.Comment.id == comment_id).first()
    if comment is None: # 如果找不到文章，回應 404 錯誤
        raise HTTPException(status_code=404, detail='comment was not found')
    return comment


# 定義路由：刪除一篇comment
@app.delete("/comments/{comment_id}", status_code=status.HTTP_200_OK)
async def delet_comment(comment_id: int, db: db_dependency):
    # 查找需要刪除的comment
    db_comment = db.query(models.Comment).filter(models.Comment.id == comment_id).first()
    if db_comment is None: # 如果找不到comment，回應 404 錯誤
        raise HTTPException(status_code=404, detail='post was not found')
    db.delete(db_comment) # 刪除comment
    db.commit() # 提交更改保存到資料庫


# 定義路由：創建一個用戶
@app.post("/users/", status_code=status.HTTP_201_CREATED)
async def create_user(user: UserBase, db: db_dependency):
    # 根據請求資料創建一個新的 User 對象
    db_user = models.User(**user.dict())  
    db.add(db_user) # 將新用戶加入資料庫
    db.commit() # 提交更改保存到資料庫


# 定義路由：讀取用戶信息
@app.get("/users/{user_id}", status_code=status.HTTP_200_OK)
async def read_user(user_id: int, db: db_dependency): 
    # 從資料庫查找對應 ID 的用戶
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail='user was not found') # 如果找不到用戶，回應 404 錯誤
    return user # 返回用戶資料

# 定義路由：刪除user
@app.delete("/users/{user_id}", status_code=status.HTTP_200_OK)
async def delet_user(user_id: int, db: db_dependency):
    # 查找需要刪除的文章
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if db_user is None: # 如果找不到文章，回應 404 錯誤
        raise HTTPException(status_code=404, detail='post was not found')
    db.delete(db_user) # 刪除文章
    db.commit() # 提交更改保存到資料庫


#直接run code就能執行網頁，不用在命令列run
if __name__ == '__main__':
    uvicorn.run(app="main:app", reload=True)