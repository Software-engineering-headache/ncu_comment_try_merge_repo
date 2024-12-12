// 使用 async / await 重構 checkLoginStatus 函式
async function checkLoginStatus() {
    const memberButton = document.querySelector('.dropdown-button-member');
    const adminButton = document.querySelector('.dropdown-button-admin');

    // 預設先隱藏兩個按鈕
    memberButton.style.display = 'none';
    adminButton.style.display = 'none';

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

        // 檢查是否有學號（studentId）和帳戶類型（accountType）
        if (profileData.studentId && profileData.accountType) {
            showMember = true; // 會員按鈕預備顯示
            // 在這裡設定全域變數 currentStudentId
            currentStudentId = profileData.studentId; 
            
            if (profileData.accountType === 'ADMIN') {
                showAdmin = true;  // 如果是管理員，預備顯示管理員按鈕
            }
        } else {
            // 若無 studentId，則視為未登入
            currentStudentId = null;
        }

        // 所有判斷完成後，再一起顯示/隱藏
        memberButton.style.display = showMember ? 'inline-block' : 'none';
        adminButton.style.display = showAdmin ? 'inline-block' : 'none';

    } catch (error) {
        console.error('檢查登入狀態失敗：', error);
        // 發生錯誤時保持都隱藏
        currentStudentId = null;
        memberButton.style.display = 'none';
        adminButton.style.display = 'none';
    }
}

// 在 DOM 加載完成後調用函式
window.addEventListener('DOMContentLoaded', checkLoginStatus);
