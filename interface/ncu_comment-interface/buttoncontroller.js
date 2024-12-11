// 使用 async / await 重構 checkLoginStatus 函式
async function checkLoginStatus() {
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

        // 檢查是否有學號（studentId）和帳戶類型
        if (profileData.studentId && profileData.accountType) {
            // 顯示會員功能按鈕
            document.querySelector('.dropdown-button-member').style.display = 'inline-block';

            // 顯示管理員功能按鈕（如果是 ADMIN）
            if (profileData.accountType == 'ADMIN') {
                document.querySelector('.dropdown-button-admin').style.display = 'inline-block';
            } else {
                // 確保非 ADMIN 用戶隱藏管理員按鈕
                document.querySelector('.dropdown-button-admin').style.display = 'none';
            }
        } else {
            console.log('未抓到學號或帳戶類型，按鈕保持隱藏');
            document.querySelector('.dropdown-button-admin').style.display = 'none';
            document.querySelector('.dropdown-button-member').style.display = 'none';
        }

    } catch (error) {
        console.error('檢查登入狀態失敗：', error);
        // 隱藏按鈕以防止錯誤狀態下顯示
        document.querySelector('.dropdown-button-admin').style.display = 'none';
        document.querySelector('.dropdown-button-member').style.display = 'none';
    }
}

// 在 DOM 加載完成後調用函式
window.addEventListener('DOMContentLoaded', checkLoginStatus);