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
