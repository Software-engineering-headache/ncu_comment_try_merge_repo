// 切換下拉選單顯示
function toggleDropdown() {
    const dropdown = document.getElementById("dropdown-content");
    dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
}

// 顯示選擇的區域
function showSection(sectionId) {
    const sections = document.querySelectorAll(".section");
    sections.forEach(section => {
        section.classList.add("hidden");
    });
    document.getElementById(sectionId).classList.remove("hidden");
    toggleDropdown(); // 關閉下拉選單
}

// 刪除評論功能
function deleteComment(element) {
    if (confirm("確定要刪除這則評論嗎？")) {
        element.parentElement.remove();
    }
}
