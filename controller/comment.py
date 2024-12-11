from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.database import SessionLocal
from sqlalchemy import func
from database.models import User, Professor, Comment, Course

router = APIRouter()

@router.get("/courses/info")
async def get_info_in_course(course_name: str):
    """
    查詢指定 Course 的 Info
    """
    db = SessionLocal()
    try:
        # 執行查詢：關聯 Course 和 Professor
        results = (
            db.query(
                Course.name.label("course_name"),
                Course.id.label("course_id"),
                Course.course_info.label('course_info'),
                Course.course_year.label('course_year'),
                Professor.name.label("professor_name")
            )
            .select_from(Course)  # 選擇 Course 表
            .join(Professor, Professor.id == Course.professor_id)  # 關聯 Professor 和 Course
            .filter(
                Course.name.contains(course_name),
            )
            .all()
        )

        # 整理查詢結果為結構化的列表
        courses_details = []
        for result in results:
            courses_details.append({
                "course_name": result.course_name,
                "professor_name": result.professor_name,
                "course_id": result.course_id,
                "course_info": result.course_info,
                "course_year": result.course_year
            })

        return courses_details

    except Exception as e:
        print(f"Error occurred in get_courses_with_professors: {e}")
        raise HTTPException(status_code=500, detail=f"Error occurred: {e}")
    finally:
        db.close()

@router.get("/courses/comments")
async def get_comment_in_course(course_name: str):
    """
    查詢指定 Course 的 Comment
    """
    db = SessionLocal()
    try:
        # 執行查詢：關聯 Course 和 Professor
        results = (
            db.query(
                Comment.score.label("course_score"),
                Comment.content.label("course_content"),
                Comment.time.label('time'),
                User.chineseName.label("chinesename"),
                Professor.name.label("professor_name")
            )
            .select_from(Comment)  # 選擇 Course 表
            .join(Course, Course.id == Comment.course_id)  # 關聯 Professor 和 Course
            .join(Professor, Professor.id == Course.professor_id)  # 關聯 Professor 和 Course
            .join(User, User.studentId == Comment.user_id)  # 關聯 Professor 和 Course
            .filter(
                Course.name.contains(course_name),
            )
            .all()
        )

        # 整理查詢結果為結構化的列表
        courses_details = []
        for result in results:
            courses_details.append({
                "chinesename": result.chinesename,
                "course_content": result.course_content,
                "course_score": result.course_score,
                "professor_name": result.professor_name,
                "time": result.time
            })

        return courses_details

    except Exception as e:
        print(f"Error occurred in get_courses_with_professors: {e}")
        raise HTTPException(status_code=500, detail=f"Error occurred: {e}")
    finally:
        db.close()
