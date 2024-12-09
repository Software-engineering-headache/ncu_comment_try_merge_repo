from fastapi import APIRouter, HTTPException
from sqlalchemy.orm import Session
from database.database import SessionLocal
from database.models import User

# 創建路由器
router = APIRouter()

# 創建數據庫會話
db = SessionLocal()

@router.get("/users/admins")
async def get_admin_users():
    """
    查詢 users 表格中 accountType 為 ADMIN 的使用者資料
    """
    try:
        # 查詢 accountType 為 ADMIN 的使用者
        admin_users = db.query(User).filter(User.accountType == "ADMIN").all()

        # 整理結果
        admin_users_details = []
        for user in admin_users:
            admin_users_details.append({
                "studentId": user.studentId,
                "accountType": user.accountType,
                "chineseName": user.chineseName,
                "englishName": user.englishName,
                "gender": user.gender,
                "birthday": user.birthday,
                "email": user.email,
            })

        return admin_users_details
    except Exception as e:
        print(f"Error occurred in get_admin_users: {e}")
        raise HTTPException(status_code=500, detail=f"Error occurred: {e}")
    finally:
        db.close()
