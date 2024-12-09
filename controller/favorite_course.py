from fastapi import FastAPI, Request, Depends, APIRouter, HTTPException
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import select
from database.database import SessionLocal
from database.models import Favorite, User, Course  # 載入表格模型


# 創建數據庫會話
db = SessionLocal()


import os
router = APIRouter()


def get_favorites_with_details():
    try:
        # 修改查詢語句
        query = (
            db.query(Favorite, User, Course)
            .join(User, Favorite.user_id == User.studentId)  # 關聯 studentId
            .join(Course, Favorite.course_id == Course.id)
        )

        # 執行查詢並獲取結果
        results = query.all()

        # 格式化輸出
        favorites = []
        for favorite, user, course in results:
            favorites.append({
                "favorite_id": favorite.id,
                "user_studentId": user.studentId,  # 使用 studentId
                "user_name": user.chineseName,
                "course_id": course.id,
                "course_name": course.name,
                "course_info": course.course_info,
            })

        return favorites
    except Exception as e:
        print(f"Error: {e}")
        return []
    finally:
        db.close()


    try:
        # 查詢 favorites 表格中的 user_id 和 course_id，並關聯 users 和 courses 表格
        query = (
            db.query(Favorite, User, Course)
            .join(User, Favorite.user_id == User.id)
            .join(Course, Favorite.course_id == Course.id)
        )

        # 執行查詢並獲取結果
        results = query.all()

        # 格式化輸出
        favorites = []
        for favorite, user, course in results:
            favorites.append({
                "favorite_id": favorite.id,
                "user_id": user.id,
                "user_name": user.chineseName,
                "course_id": course.id,
                "course_name": course.name,
                "course_info": course.course_info,
            })

        return favorites
    except Exception as e:
        print(f"Error: {e}")
        return []
    finally:
        db.close()

# 調用函式並打印結果
favorites_with_details = get_favorites_with_details()
for item in favorites_with_details:
    print(item)
