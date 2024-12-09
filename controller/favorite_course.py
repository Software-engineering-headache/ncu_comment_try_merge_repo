from fastapi import APIRouter, HTTPException
from sqlalchemy.orm import Session
from database.database import SessionLocal
from database.models import Favorite, User, Course

# 創建路由器
router = APIRouter()

# 創建數據庫會話
db = SessionLocal()

@router.get("/favorites/details")
async def get_favorites_with_details():
    """
    查詢 favorites 表格中的資料，並獲取相關的 user 和 course 資訊
    """
    try:
        # 查詢 favorites 並關聯 users 和 courses
        results = (
            db.query(Favorite, User, Course)
            .join(User, Favorite.user_id == User.id)
            .join(Course, Favorite.course_id == Course.id)
            .all()
        )

        # 整理結果
        favorites_details = []
        for favorite, user, course in results:
            favorites_details.append({
                "favorite_id": favorite.id,
                "user_id": user.id,
                "user_name": user.chineseName,
                "course_id": course.id,
                "course_name": course.name,
                "course_info": course.course_info,
            })

        return favorites_details
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error occurred: {e}")
    finally:
        db.close()
