from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database.database import SessionLocal
from database.models import Favorite, User, Course

# 創建路由器
router = APIRouter()

# 定義新增收藏需要的參數模型
class FavoriteCreate(BaseModel):
    user_id: str
    course_id: str

@router.get("/favorites/details")
async def get_favorites_with_details():
    """
    查詢 favorites 表格中的資料，並獲取相關的 user 和 course 資訊
    """
    db = SessionLocal()
    try:
        # 查詢 favorites 並關聯 users 和 courses
        results = (
            db.query(Favorite, User, Course)
            .join(User, Favorite.user_id == User.studentId)  # 使用 User.studentId 對應
            .join(Course, Favorite.course_id == Course.id)
            .all()
        )

        # 整理結果
        favorites_details = []
        for favorite, user, course in results:
            favorites_details.append({
                "favorite_id": favorite.id,
                "user_id": user.studentId,
                "user_name": user.chineseName,
                "course_id": course.id,
                "course_name": course.name,
                "course_info": course.course_info,
            })

        return favorites_details
    except Exception as e:
        print(f"Error occurred in get_favorites_with_details: {e}")
        raise HTTPException(status_code=500, detail=f"Error occurred: {e}")
    finally:
        db.close()

@router.post("/favorites/add")
async def add_favorite(fav: FavoriteCreate):
    """
    將指定使用者與課程加入 favorites
    """
    db = SessionLocal()
    try:
        # 新增收藏紀錄
        new_fav = Favorite(user_id=fav.user_id, course_id=fav.course_id)
        db.add(new_fav)
        db.commit()
        db.refresh(new_fav)
        return {"message": "Course added to favorites successfully", "favorite_id": new_fav.id}
    except Exception as e:
        db.rollback()
        print(f"Error occurred in add_favorite: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()
