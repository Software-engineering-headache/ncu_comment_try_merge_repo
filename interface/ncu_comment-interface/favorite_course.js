// 定義 API URL
const API_URL = "http://127.0.0.1:8000/favorites/details";
const PROFILE_URL = "http://localhost:8000/api/profile";

// DOM 元素
const dataContainer = document.getElementById("dataContainer");

// 全域變數儲存當前使用者的學號
let currentStudentId = null;

// 使用 async/await 重構 checkLoginStatus 函式
async function checkLoginStatus() {
    console.log("checkLoginStatus start...");
    const memberButton = document.querySelector('.dropdown-button-member');
    const adminButton = document.querySelector('.dropdown-button-admin');

    // 預設先隱藏兩個按鈕
    memberButton.style.display = 'none';
    adminButton.style.display = 'none';

    try {
        // 檢查登入狀態
        const profileResponse = await fetch(PROFILE_URL, {
            credentials: "include",
        });

        if (!profileResponse.ok) {
            throw new Error(`HTTP error! Status: ${profileResponse.status}`);
        }

        const profileData = await profileResponse.json();
        console.log('Profile Data:', profileData);

        let showMember = false;
        let showAdmin = false;

        // 檢查是否有學號與帳戶類型
        if (profileData.studentId && profileData.accountType) {
            showMember = true;
            currentStudentId = profileData.studentId; // 設定登入使用者學號
            console.log("取得登入使用者學號:", currentStudentId);
            if (profileData.accountType === 'ADMIN') {
                showAdmin = true;
            }
        }

        // 根據登入資訊顯示/隱藏按鈕
        memberButton.style.display = showMember ? 'inline-block' : 'none';
        adminButton.style.display = showAdmin ? 'inline-block' : 'none';

        console.log("checkLoginStatus completed, currentStudentId:", currentStudentId);
        // 回傳是否成功取得ID
        return currentStudentId !== null;

    } catch (error) {
        console.error('檢查登入狀態失敗：', error);
        currentStudentId = null;
        return false;
    }
}

// 抓取收藏課程資料
async function fetchData() {
    console.log("fetchData start... currentStudentId:", currentStudentId);

    try {
        // 顯示載入中提示
        dataContainer.innerHTML = `<p style="color: blue; margin-left: 40px;">Loading data, please wait...</p>`;

        // 若尚未取得 currentStudentId，顯示未登入訊息
        if (!currentStudentId) {
            console.log("未取得 currentStudentId，顯示未登入訊息");
            dataContainer.innerHTML = `<p style="color: blue;margin-left: 40px;">您尚未登入，請先登入後查看收藏課程。</p>`;
            return;
        }

        // 發送 API 請求取得收藏課程
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        // 解析返回的 JSON 數據
        const data = await response.json();
        console.log("取得收藏課程資料:", data);

        // 根據當前使用者的 studentId 過濾資料
        const filteredData = data.filter(item => item.user_id === currentStudentId);
        console.log("filteredData:", filteredData);

        // 清空容器
        dataContainer.innerHTML = "";

        // 如果過濾後沒有數據，顯示提示
        if (filteredData.length === 0) {
            dataContainer.innerHTML = `<p style="color: blue;margin-left: 40px;">尚未將課程加入收藏！</p>`;
            return;
        }

        // 建立表格結構
        const table = document.createElement("table");
        table.style.width = "95%";
        table.style.margin = "20px auto";
        table.style.borderCollapse = "collapse";
        table.innerHTML = `
            <thead>
                <tr style="background-color: #d2e8f2;">
                    <th style="border: 1px solid #ddd; padding: 8px;">課程代碼</th>
                    <th style="border: 1px solid #ddd; padding: 8px;">課程名稱</th>
                    <th style="border: 1px solid #ddd; padding: 8px;">學分數</th>
                    <th style="border: 1px solid #ddd; padding: 8px;">操作</th>
                </tr>
            </thead>
            <tbody>
            </tbody>
        `;

        const tbody = table.querySelector("tbody");

        // 將篩選後的數據動態插入表格
        filteredData.forEach((item, index) => {
            const row = document.createElement("tr");
            row.style.backgroundColor = index % 2 === 0 ? "#f9f9f9" : "#ffffff";
            row.innerHTML = `
                <td style="border: 1px solid #ddd; padding: 8px;">${item.course_id}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${item.course_name}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${item.course_info}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">
                    <button class="btn" style="margin-left: 10px; margin-right: 10px;" onclick="viewComment('${item.course_id}')">查看評論</button>
                    <button class="btn" style="background-color: #ff6666;" onclick="removeFromFavorites('${item.favorite_id}')">取消收藏</button>
                </td>
            `;
            tbody.appendChild(row);
        });

        // 將表格插入到容器中
        dataContainer.appendChild(table);
        console.log("fetchData completed.");
    } catch (error) {
        console.error("Fetch Error:", error);
        dataContainer.innerHTML = `<p style="color: red;margin-left: 40px;">Failed to fetch data. Please check the API and try again.</p>`;
    }
}

// 查看評論功能
function viewComment(courseId) {
    alert(`查看課程 ${courseId} 的評論`);
}

function removeFromFavorites(favoriteId) {
    alert(`已將收藏 ID ${favoriteId} 從收藏中移除`);
}

// DOM 載入後先檢查登入，再決定是否抓取收藏資料
window.addEventListener("DOMContentLoaded", async () => {
    console.log("DOMContentLoaded...");
    const isLoggedIn = await checkLoginStatus();
    console.log("使用者已登入:", isLoggedIn, " currentStudentId:", currentStudentId);

    if (isLoggedIn) {
        console.log("使用者已登入，呼叫 fetchData...");
        await fetchData();
    } else {
        console.log("使用者未登入，不呼叫 fetchData，只顯示提示訊息");
        dataContainer.innerHTML = `<p style="color: gray;">您尚未登入，請先登入後查看收藏課程。</p>`;
    }
});
