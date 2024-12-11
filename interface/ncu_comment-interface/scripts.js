// 目前還在測試中，因為資料到介面就不見了，但是API是有丟資料的
API_URL1 = "http://127.0.0.1:8000/courses/comments";
API_URL2 = "http://127.0.0.1:8000/courses/info";

// 當頁面載入完成後，從 URL 取得課程名稱，並呼叫 fetchComments 函式
document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const courseName = params.get('course_name');
    if (courseName) {
        fetchComments(courseName);
    }
});

function fetchComments(courseName) {
    //fetch(`${API_URL1}?course_name${courseName}`)
        //.then(response => response.json())
        //.then(data => {showSearchResults(data);})
        //.catch(error => {
            //console.error('Error fetching comments:', error);
        //});
    const fakeData = [
        { chinesename: '張三', course_score: 5, course_content: '這是一個很棒的課程！', professor_name: '李四', time: '2023-10-01T12:00:00Z' },
        { chinesename: '王五', course_score: 4, course_content: '課程內容豐富，老師講解清晰。', professor_name: '李四', time: '2023-10-02T12:00:00Z' }
    ];
    showSearchResults(fakeData);
}

function showSearchResults(results) {
    const commentItem = document.getElementById('comment-list');
    commentItem.innerHTML = '';
        results.forEach(result => {
            const commentItem = document.createElement('div');
            commentItem.innerHTML = `
                <div class="comment-item">
                    <p><strong>${result.chinesename}</strong> <span class="rating">${'★'.repeat(result.course_score)}</span></p>
                    <p>${result.course_content}</p>
                    <p class="meta">受評教授：${result.professor_name} | 日期：${new Date(result.time).toLocaleString()}</p>
                </div>
            `;
        commentItem.appendChild(commentItem);
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
