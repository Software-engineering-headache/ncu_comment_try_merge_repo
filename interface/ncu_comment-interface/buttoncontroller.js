// 快取有效時間（以毫秒為單位，例如 10 分鐘）
const CACHE_EXPIRATION_TIME = 10 * 60 * 1000;

async function checkLoginStatus() {
    const loginButton = document.getElementById('loginButton');
    const memberButton = document.querySelector('.dropdown-button-member');
    const adminButton = document.querySelector('.dropdown-button-admin');
    const logoutLink = document.getElementById('logoutLink');

    // 清除本地快取以避免使用過期的資料
    localStorage.removeItem('loginStatusCache');

    // 檢查本地快取
    const cachedData = getCachedLoginStatus();

    if (cachedData) {
        // 若快取有效，直接使用快取數據
        console.log("使用快取的登入狀態資料:", cachedData);
        setButtonVisibility({
            login: !cachedData.loggedIn,
            member: cachedData.loggedIn,
            admin: cachedData.isAdmin,
            logout: cachedData.loggedIn,
        });
        return;
    }

    // 若無快取或快取無效，請求伺服器
    try {
        const profileResponse = await fetch('http://localhost:8000/api/profile', {
            credentials: "include",
        });
        const Islogin = await fetch('http://localhost:8000/interface/ncu_comment-interface/Islogin', {
            credentials: "include",
        });

        if (!profileResponse.ok) {
            // 伺服器未正確返回，設定為未登入狀態
            setButtonVisibility({ login: true, member: false, admin: false, logout: false });
            return;
        }

        const profileData = await profileResponse.json();
        const IsloginData = await Islogin.json();

        console.log("伺服器返回的登入狀態資料:", profileData);
        console.log("Received accountType:", profileData.accountType); // Log the accountType

        // 處理登入狀態
        const loggedIn = !!IsloginData.studentId;
        const isAdmin = profileData.accountType === 'ADMIN';  // No need to convert case if already uppercase

        // 更新按鈕顯示狀態
        setButtonVisibility({
            login: !loggedIn,
            member: loggedIn,
            admin: isAdmin,
            logout: loggedIn,
        });

        // 保存到本地快取
        cacheLoginStatus({ loggedIn, isAdmin });
    } catch (error) {
        console.error('檢查登入狀態失敗:', error);

        // 發生錯誤時，設置未登入狀態
        setButtonVisibility({ login: true, member: false, admin: false, logout: false });
    }
}

// 統一設置按鈕顯示狀態
function setButtonVisibility({ login, member, admin, logout }) {
    document.getElementById('loginButton').style.display = login ? 'inline-block' : 'none';
    document.querySelector('.dropdown-button-member').style.display = member ? 'inline-block' : 'none';
    document.querySelector('.dropdown-button-admin').style.display = admin ? 'inline-block' : 'none';
    document.getElementById('logoutLink').style.display = logout ? 'inline-block' : 'none';
}

// 獲取本地快取的登入狀態
function getCachedLoginStatus() {
    const cachedData = JSON.parse(localStorage.getItem('loginStatusCache'));
    if (!cachedData) return null;

    const now = Date.now();
    if (now - cachedData.timestamp > CACHE_EXPIRATION_TIME) {
        // 快取過期，清除快取
        localStorage.removeItem('loginStatusCache');
        return null;
    }

    return cachedData;
}

// 保存登入狀態到本地快取
function cacheLoginStatus({ loggedIn, isAdmin }) {
    const now = Date.now();
    const cacheData = {
        loggedIn,
        isAdmin,
        timestamp: now,
    };

    localStorage.setItem('loginStatusCache', JSON.stringify(cacheData));
}

// 在 DOM 加載完成後調用函式

window.addEventListener('DOMContentLoaded', checkLoginStatus);