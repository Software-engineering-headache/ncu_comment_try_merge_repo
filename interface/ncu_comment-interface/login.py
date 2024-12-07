from fastapi import FastAPI, Request, Depends
from fastapi.responses import RedirectResponse
from requests_oauthlib import OAuth2Session
from typing import Optional

import os
##跑之前先輸入uvicorn login:app --reload
app = FastAPI()

# OAuth2 的配置
CLIENT_ID = "202412061221336VwNe1cJtnCB"
CLIENT_SECRET = "kJVvHyM2Am3SYrdeBCBUSomnSbkBLb09jQEHr1odgBc8W8nv"
AUTHORIZATION_BASE_URL = "https://portal.ncu.edu.tw/oauth2/authorization"
TOKEN_URL = "https://portal.ncu.edu.tw/oauth2/token"
REDIRECT_URI = "http://localhost:8000/interface/ncu_comment-interface/index.html"
token_storage = {}


# 初始化 OAuth2Session
def get_oauth_session(state: Optional[str] = None):
    return OAuth2Session(
        CLIENT_ID,
        redirect_uri=REDIRECT_URI,
        scope=["identifier", "email", "chinese-name"],
        state=state,
    )

@app.get("/")
async def index():
    return {"message": "Welcome to NCU OAuth integration! Visit /login to start the authorization process."}

# 路由：引導用戶授權
@app.get("/interface/ncu_comment-interface/login")
async def login():
    oauth = get_oauth_session()
    authorization_url, state = oauth.authorization_url(AUTHORIZATION_BASE_URL)

    # 存儲 state 值（可以保存在 session 中），這裡為了簡單起見，直接用 state 傳回來
    response = RedirectResponse(url=authorization_url)
    return response

# 路由：處理回調
@app.get("/interface/ncu_comment-interface/index.html")
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
        return {"message": "Authorization successful!", "token": token}
    except Exception as e:
        return {"error": str(e)}

# 路由：使用令牌獲取用戶信息
@app.get("/interface/ncu_comment-interface/profile")
async def profile():
    # token = "YOUR_SAVED_ACCESS_TOKEN"  # 在實際應用中，應該從安全的存儲中獲取這個令牌
    token = token_storage.get("token")
    oauth = OAuth2Session(CLIENT_ID, token={"access_token": token, "token_type": "Bearer"})
    
    response = oauth.get("https://portal.ncu.edu.tw/apis/oauth/v1/info")
    user_info = response.json()
    return {"user_info": user_info}

# 運行 FastAPI
if __name__ == "__main__":
    import uvicorn
    import webbrowser
    url = "http://127.0.0.1:5500/interface/ncu_comment-interface/index.html"
    print(f"後端服務運行中，請訪問 {url}")
    
    # 在瀏覽器中打開指定 URL
    webbrowser.open(url)
    
    # 啟動 uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
