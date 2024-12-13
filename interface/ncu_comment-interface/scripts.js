// 目前還在測試中，因為資料到介面就不見了，但是API是有丟資料的
API_URL1 = "http://127.0.0.1:8000/courses/comments";
API_URL2 = "http://127.0.0.1:8000/courses/info";

// 當頁面載入完成後，從 URL 取得課程名稱，並呼叫 fetchComments 函式
document.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(window.location.search);
    const courseName = params.get("course_name");

    if (courseName) {
        try {
            await fetchCourseInfo(courseName);
            await fetchComments(courseName);
        } catch (error) {
            console.error("Error fetching course data:", error);
        }
    }
});

async function fetchCourseInfo(courseName) {
    try {
        const response = await fetch(`${API_URL1}?course_name=${encodeURIComponent(courseName)}`);
        if (!response.ok) throw new Error(`Failed to fetch course info: ${response.statusText}`);
        
        const data = await response.json();
        renderCourseInfo(courseName, data[0]); // 假設 API 返回的是列表，取第一個結果
        //console.log(data[0]);
    } catch (error) {
        console.error("Error fetching course info:", error);
    }
}

function renderCourseInfo(course_name, courseInfo) {
    const courseDetailTable = document.querySelector(".course-detail table");
    console.log(courseInfo);

    if (courseInfo) {
        document.querySelector("#course-name").textContent = course_name || "未提供";
        document.querySelector("#professor-name").textContent = courseInfo.professor_name.join(", ") || "未提供";
        document.querySelector("#department-name").textContent = courseInfo.department_name || "未提供";
        document.querySelector("#course-info").textContent = courseInfo.course_info ? String(courseInfo.course_info): "未提供" ;
        document.querySelector("#course-year").textContent = courseInfo.course_year ? String(courseInfo.course_year): "未提供" ; // 假設固定值，可替換為動態數據
    } else {
        // 如果沒有資料，設置為默認提示
        document.querySelector("#course-name").textContent = "無相關課程資訊";
        document.querySelector("#professor-name").textContent = "無相關資訊";
        document.querySelector("#department-name").textContent = "無相關資訊";
        document.querySelector("#course-info").textContent = "無相關資訊";
        document.querySelector("#course-year").textContent = "無相關資訊";
    }
}

async function fetchComments(courseName) {
    try {
        const response = await fetch(`${API_URL2}?course_name=${encodeURIComponent(courseName)}`);
        if (!response.ok) throw new Error(`Failed to fetch comments: ${response.statusText}`);
        
        const data = await response.json();
        renderComments(data);
    } catch (error) {
        console.error("Error fetching comments:", error);
    }
}

function renderComments(comments) {
    const commentList = document.getElementById("comment-list");
    commentList.innerHTML = ""; // 清空評論列表

    if (comments.length === 0) {
        commentList.innerHTML = "<p>目前無評論。</p>";
        return;
    }

    comments.forEach((comment) => {
        const commentItem = document.createElement("div");
        commentItem.className = "comment-item";
        commentItem.innerHTML = `
            <p><strong>${comment.chinesename}</strong> <span class="rating">${"★".repeat(comment.course_score)}</span></p>
            <p>${comment.course_content}</p>
            <p class="meta">受評教授：${comment.professor_name.join(", ")} | 日期：${comment.time}</p>
        `;
        commentList.appendChild(commentItem);
    });
}

// 判斷登入狀態（模擬）
const isLoggedIn = true; // 設為 true 代表已登入 false

// 開啟與關閉評論視窗
document.getElementById("review-button").addEventListener("click", function() {
    if (isLoggedIn) {
        openModal();
    } else {
        window.location.href = "login.html"; // 跳轉登入頁面
    }
});

function openModal() {
    document.getElementById("review-modal").style.display = "flex";
}

function closeModal() {
    document.getElementById("review-modal").style.display = "none";
}

// 選擇評分星級
function setRating(stars) {
    const starElements = document.querySelectorAll("#rating .star");
    starElements.forEach((star, index) => {
        if (index < stars) {
            star.classList.add("selected");
        } else {
            star.classList.remove("selected");
        }
    });
}

// 送出評論
function submitReview() {
    const commentText = document.getElementById("comment-text").value;
    if (commentText.length > 1500) {
        document.getElementById("alert-modal").style.display = "flex";
    } else {
        // 提交評論的邏輯可放在這裡（如使用 AJAX 提交到後端）
        closeModal();
    }
}

// 關閉警告視窗
function closeAlert() {
    document.getElementById("alert-modal").style.display = "none";
}
