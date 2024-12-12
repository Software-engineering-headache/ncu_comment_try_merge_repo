// 使用 async / await 重構 checkLoginStatus 函式
async function checkLoginStatus() {
    const loginButton = document.getElementById('loginButton');
    const memberButton = document.querySelector('.dropdown-button-member');
    const adminButton = document.querySelector('.dropdown-button-admin');
    const logoutLink = document.getElementById('logoutLink'); // 取得登出連結元素

    try {
        // 檢查登入狀態
        const profileResponse = await fetch('http://localhost:8000/api/profile', {
            credentials: "include",
        });

        if (!profileResponse.ok) {
            throw new Error(`HTTP error! Status: ${profileResponse.status}`);
        }

        const profileData = await profileResponse.json();
        console.log('Profile Data:', profileData);

        let showMember = false;
        let showAdmin = false;
        let showLogin = true; // 預設未登入時顯示登入按鈕
        let showLogout = false; // 預設未登入時登出隱藏

        // 檢查是否有學號（studentId）和帳戶類型（accountType）
        if (profileData.studentId && profileData.accountType) {
            // 已登入
            showMember = true;
            showLogin = false; // 已登入則不顯示登入按鈕
            showLogout = true; // 已登入顯示登出
            currentStudentId = profileData.studentId; 

            if (profileData.accountType === 'ADMIN') {
                showAdmin = true;
            }
        } else {
            // 未登入
            currentStudentId = null;
            // showLogin 保持為 true
            // showLogout 保持為 false
        }

        // 根據狀態顯示/隱藏
        loginButton.style.display = showLogin ? 'inline-block' : 'none';
        memberButton.style.display = showMember ? 'inline-block' : 'none';
        adminButton.style.display = showAdmin ? 'inline-block' : 'none';
        logoutLink.style.display = showLogout ? 'inline-block' : 'none';

    } catch (error) {
        console.error('檢查登入狀態失敗：', error);
        currentStudentId = null;
        // 發生錯誤時保持預設狀態：登入顯示、會員/管理員/登出隱藏
        loginButton.style.display = 'inline-block'; 
        memberButton.style.display = 'none';
        adminButton.style.display = 'none';
        logoutLink.style.display = 'none';
    }
}

// 在 DOM 加載完成後調用函式
window.addEventListener('DOMContentLoaded', checkLoginStatus);
