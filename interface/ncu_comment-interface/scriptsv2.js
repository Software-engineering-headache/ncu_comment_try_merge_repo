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


//搜尋評論功能
function handleSearchButtonClick() {
    const department = document.getElementById('department').value;
    const instructor = document.getElementById('instructor').value;
    const keyword = document.getElementById('keyword').value;

    if (department === '選擇系所' || instructor.trim() === '' || keyword.trim() === '') {
        alert('輸入資料不完整');
        return;
    }

    // 隱藏 Hero 文字
    document.getElementById('hero').style.display = 'none';

    // 顯示搜尋結果表格
    const courseListSection = document.getElementById('courseList');
    courseListSection.style.display = 'block';

    // 插入搜尋結果資料
    const tbody = courseListSection.querySelector('tbody');
    tbody.innerHTML = `
        <tr>
            <td>${department}</td>
            <td>43030</td>
            <td>軟體工程 I</td>
            <td>${instructor}</td>
            <td>2</td>
            <td>
                <button class="btn" onclick="window.location.href='newCommentv2.html'">我要評論</button>
                <button class="btn">加入收藏</button>
            </td>
        </tr>
        <tr>
            <td>${department}</td>
            <td>43039</td>
            <td>企業電腦網路</td>
            <td>${instructor}</td>
            <td>1</td>
            <td>
                <button class="btn" onclick="window.location.href='newCommentv2.html'">我要評論</button>
                <button class="btn">加入收藏</button>
            </td>
        </tr>
    `;
}

// 綁定事件
function initializeSearchButton() {
    const searchButton = document.getElementById('searchButton');
    if (searchButton) {
        searchButton.addEventListener('click', handleSearchButtonClick);
    }
}

// 確保 DOM 加載後執行
document.addEventListener('DOMContentLoaded', initializeSearchButton);
