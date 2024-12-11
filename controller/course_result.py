from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.database import SessionLocal
from sqlalchemy import func
from database.models import Course, Professor, College, Comment

router = APIRouter()

@router.get("/courses/results")
async def get_courses_with_professors(department: str, instructor: str, keyword: str):
    """
    查詢 Course 表中的資訊，並顯示對應的 Professor 名稱
    """
    db = SessionLocal()
    try:
        # 執行查詢：關聯 Course 和 Professor
        results = (
            db.query(
                Course.id.label("course_id"),
                Course.name.label("course_name"),
                College.department_name.label("department_name"),
                Professor.name.label("professor_name"),
                func.count(Comment.course_id).label('count')
            )
            .join(Professor, Professor.id == Course.professor_id)  # 關聯 Professor 和 Course
            .join(College, College.department_id == Course.department_id)  # 關聯 Professor 和 Course
            .join(Comment, Comment.course_id == Course.id)
            .filter(
                College.department_name == department,
                Professor.name.contains(instructor),
                Course.name.contains(keyword)
            )
            .all()
        )

        # 將查詢結果轉換為字典列表
        courses_details = []
        for result in results:
            courses_details.append({
                "department_name": result.department_name,
                "course_id": result.course_id,
                "course_name": result.course_name,
                "professor_name": result.professor_name,
                "comment_count": result.count
            })

        return courses_details

    except Exception as e:
        print(f"Error occurred in get_courses_with_professors: {e}")
        raise HTTPException(status_code=500, detail=f"Error occurred: {e}")
    finally:
        db.close()
