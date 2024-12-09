// 定義 API URL
const API_URL = "http://127.0.0.1:8000/users/admins";

// DOM 元素
const dataContainer = document.getElementById("dataContainer");

// 定義函數來抓取管理員資料
async function fetchAdminUsers() {
    try {
        // 顯示載入中提示
        dataContainer.innerHTML = `<p style="color: blue;">Loading data, please wait...</p>`;

        // 發送 API 請求
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        // 解析返回的 JSON 數據
        const data = await response.json();

        // 清空容器
        dataContainer.innerHTML = "";

        // 如果沒有數據，顯示提示
        if (data.length === 0) {
            dataContainer.innerHTML = `<p style="color: gray;">No admin users found.</p>`;
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
                    <th style="border: 1px solid #ddd; padding: 8px;">學號</th>
                    <th style="border: 1px solid #ddd; padding: 8px;">姓名</th>
                    <th style="border: 1px solid #ddd; padding: 8px;">帳戶類型</th>
                    <th style="border: 1px solid #ddd; padding: 8px;">性別</th>
                    <th style="border: 1px solid #ddd; padding: 8px;">生日</th>
                    <th style="border: 1px solid #ddd; padding: 8px;">電子郵件</th>
                </tr>
            </thead>
            <tbody>
            </tbody>
        `;

        const tbody = table.querySelector("tbody");

        // 將數據動態插入表格
        data.forEach((user, index) => {
            const row = document.createElement("tr");
            row.style.backgroundColor = index % 2 === 0 ? "#f9f9f9" : "#ffffff";
            row.innerHTML = `
                <td style="border: 1px solid #ddd; padding: 8px;">${user.studentId}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${user.chineseName}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${user.accountType}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${user.gender}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${user.birthday}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${user.email}</td>
            `;
            tbody.appendChild(row);
        });

        // 將表格插入到容器中
        dataContainer.appendChild(table);
    } catch (error) {
        console.error("Fetch Error:", error);
        dataContainer.innerHTML = `<p style="color: red;">Failed to fetch data. Please check the API and try again.</p>`;
    }
}

// 當頁面載入時自動執行抓取資料函數
window.addEventListener("load", fetchAdminUsers);