// 定義 API URL
const API_URL = "http://localhost:8000/favorites/details";

// 按鈕與容器
const fetchDataButton = document.getElementById("testButton");
const dataContainer = document.getElementById("dataContainer");

// 按鈕點擊事件
fetchDataButton.addEventListener("click", async () => {
    try {
        // 獲取資料
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();

        // 清空容器
        dataContainer.innerHTML = "";

        // 動態生成資料顯示
        data.forEach(item => {
            const div = document.createElement("div");
            div.innerHTML = `
                <p><strong>Favorite ID:</strong> ${item.favorite_id}</p>
                <p><strong>User ID:</strong> ${item.user_id}</p>
                <p><strong>User Name:</strong> ${item.user_name}</p>
                <p><strong>Course ID:</strong> ${item.course_id}</p>
                <p><strong>Course Name:</strong> ${item.course_name}</p>
                <p><strong>Course Info:</strong> ${item.course_info}</p>
                <hr />
            `;
            dataContainer.appendChild(div);
        });
    } catch (error) {
        console.error("Error fetching data:", error);
        dataContainer.innerHTML = `<p style="color: red;">Failed to fetch data. Please check the API and try again.</p>`;
    }
});
