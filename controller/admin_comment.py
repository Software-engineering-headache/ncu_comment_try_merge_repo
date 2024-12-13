from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from database.database import SessionLocal
from database.models import Comment, User, Course
from sqlalchemy import func

router = APIRouter()

# 資料庫連線管理
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/admin_comments/all")
async def get_all_comments(db: Session = Depends(get_db)):
    """
    獲取所有評論
    """
    try:
        # 查詢評論及其相關的課程和用戶信息
        comments = db.query(
            Comment,
            Course.name.label("course_name"),  # 查詢課程名稱
            User.chineseName.label("user_name"),  # 查詢用戶姓名
            User.nickname.label("user_nickname"),  # 查詢用戶暱稱
            User.email.label("user_email")  # 查詢用戶郵箱
        ).join(
            Course, Comment.course_id == Course.id, isouter=True
        ).join(
            User, Comment.user_id == User.studentId, isouter=True
        ).order_by(Comment.id.desc()).all()

        # 將查詢結果整理為輸出格式
        result = []
        for comment, course_name, user_name, user_nickname, user_email in comments:
            result.append({
                "id": comment.id,
                "score": comment.score,
                "course_id": comment.course_id,
                "course_name": course_name,  # 使用查詢結果中的課程名稱
                "comment_content": comment.content,  # 新增評論內容
                "user_id": comment.user_id,
                "user_name": user_name,  # 使用查詢結果中的用戶姓名
                "user_nickname": user_nickname,  # 使用查詢結果中的用戶暱稱
                "time": comment.time.isoformat() if comment.time else None,
                "email": user_email  # 使用查詢結果中的用戶郵箱
            })
        return result

    except Exception as e:
        print(f"Error occurred in get_all_comments: {e}")
        raise HTTPException(status_code=500, detail=f"Error occurred: {e}")
