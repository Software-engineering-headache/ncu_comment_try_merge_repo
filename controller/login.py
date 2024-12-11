from fastapi import FastAPI, Request, Depends, APIRouter, HTTPException
from fastapi.responses import RedirectResponse
from requests_oauthlib import OAuth2Session
from pydantic import BaseModel
from typing import Optional
from database.main import create_user
import requests
from database.database import SessionLocal

# 創建數據庫會話
db = SessionLocal()


import os
##跑之前先輸入uvicorn login:app --reload
router = APIRouter()

# OAuth2 的配置
CLIENT_ID = "202412061221336VwNe1cJtnCB"
CLIENT_SECRET = "kJVvHyM2Am3SYrdeBCBUSomnSbkBLb09jQEHr1odgBc8W8nv"
AUTHORIZATION_BASE_URL = "https://portal.ncu.edu.tw/oauth2/authorization"
TOKEN_URL = "https://portal.ncu.edu.tw/oauth2/token"
REDIRECT_URI = "http://localhost:8000/interface/ncu_comment-interface/callback"
token_storage = {}

class UserBase(BaseModel):
    id: Optional[int] = None
    # identifier: str
    accountType: str
    chineseName: str
    englishName: str
    gender: str
    birthday: str
    # personalId: str
    studentId: str
    email: str
    # academyRecords: AcademyRecords

# 初始化 OAuth2Session
def get_oauth_session(state: Optional[str] = None):
    return OAuth2Session(
        CLIENT_ID,
        redirect_uri=REDIRECT_URI,
        scope = [
            "identifier",
            "chinese-name",
            "english-name",
            "gender",
            "birthday",
            "personal-id",
            "student-id",
            "academy-records",
            "faculty-records",
            "email",
            "mobile-phone",
            "alternated-id"
        ],
        # scope=["identifier", "email", "chinese-name"],
        state=state,
    )

# 路由：引導用戶授權
@router.get("/interface/ncu_comment-interface/login")
async def login(request: Request):
    oauth = get_oauth_session()
    authorization_url, state = oauth.authorization_url(AUTHORIZATION_BASE_URL)

    # 存儲 state 值（可以保存在 session 中），這裡為了簡單起見，直接用 state 傳回來
    request.session["oauth_state"] = state
    response = RedirectResponse(url=authorization_url)
    return response

# 路由：處理回調
@router.get("/interface/ncu_comment-interface/callback")
async def callback(request: Request):
    state = request.query_params.get("state")
    code = request.query_params.get("code")

    if not code:
        return {"error": "Authorization failed or user denied access."}

    # 獲取 OAuth2Session 物件
    oauth = get_oauth_session(state=state)

    try:
        # 使用授權碼請求訪問令牌
        token = oauth.fetch_token(
            TOKEN_URL,
            client_secret=CLIENT_SECRET,
            code=code,
        )
        token_storage["token"] = token["access_token"]
        # 存儲令牌或處理授權

        return RedirectResponse(url="http://localhost:8000/interface/ncu_comment-interface/profile")
        # return {"message": "Authorization successful!", "token": token}
    except Exception as e:
        return {"error": str(e)}

# 路由：使用令牌獲取用戶信息
@router.get("/interface/ncu_comment-interface/profile")
async def profile(request: Request):
    token = token_storage.get("token")
    oauth = OAuth2Session(CLIENT_ID, token={"access_token": token, "token_type": "Bearer"})
    
    response = oauth.get("https://portal.ncu.edu.tw/apis/oauth/v1/info")
    user_info = response.json()
    # return user_info
    # print(user_info)
    request.session["user"] = {
            "studentId": user_info["studentId"],
            "accountType": user_info["accountType"]
        }

    user = UserBase(
    accountType=user_info["accountType"],
    chineseName=user_info["chineseName"],
    englishName=user_info["englishName"],
    gender=user_info["gender"],
    birthday=user_info["birthday"],
    studentId=user_info["studentId"],
    email=user_info["email"],
    )

    await create_user(user, db)
    
    redirect_response = RedirectResponse(url="http://localhost:5500/interface/ncu_comment-interface/index.html")
    redirect_response.set_cookie(
        key="studentId",
        value=user.studentId,
        httponly=True,      # 防止 JavaScript 訪問
        secure=True,        # 僅通過 HTTPS 傳輸
        max_age=3600,       # Cookie 有效期（秒）
        path="/",           # Cookie 的作用路徑
        samesite= "strict"      # 防止 CSRF 攻擊
    )

    return redirect_response

@router.get("/interface/ncu_comment-interface/Islogin")
async def Islogin(request: Request):
    # 確保 session 和 user 存在
    user = request.session.get("user")
    print(user)
    if not user or "studentId" not in user:
        return {
        "studentId": None,
        "accountType": None  # 默認為普通用戶
    }

    # 返回用戶資訊
    return {
        "studentId": user["studentId"],
        "accountType": user["accountType"]  # 默認為普通用戶
    }

@router.get("/interface/ncu_comment-interface/logout")
async def logout(request: Request):
    request.session.clear()  # 清除伺服器端 Session
    return RedirectResponse(url="http://localhost:5500/interface/ncu_comment-interface/index.html")
