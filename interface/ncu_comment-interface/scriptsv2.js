// 切換下拉選單顯示
// function toggleDropdown() {
//     const dropdown = document.getElementById("dropdown-content");
//     dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
// }

// 顯示選擇的區域
async function checkLoginStatus() {
    try {
        const response = await fetch('http://localhost:8000/interface/ncu_comment-interface/Islogin', {
            credentials: 'include', // 確保 Cookie 被自動帶上
        });

        if (response.ok) {
            const data = await response.json();
            console.log('用戶已登入：', data);

            // 檢查是否有學號（studentId）
            if (data.studentId) {
                // 顯示會員功能按鈕
                document.querySelector('.dropdown-button-member').style.display = 'inline-block';

                // 顯示管理員功能按鈕（如果需要進一步判斷可以打開下面註解）
                if (data.accountType === 'ADMIN') {
                    document.querySelector('.dropdown-button-admin').style.display = 'inline-block';
                }
            } else {
                console.log('未抓到學號，按鈕保持隱藏');
                document.querySelector('.dropdown-button-admin').style.display = 'none';
                document.querySelector('.dropdown-button-member').style.display = 'none';
            }
        } else {
            console.log('未登入，按鈕保持隱藏');
        }

    } catch (error) {
        console.error('檢查登入狀態失敗：', error);
    }
}

// 頁面加載時檢查登入狀態
document.addEventListener('DOMContentLoaded', () => {
    checkLoginStatus();
});

function showSection(sectionId) {
    const sections = document.querySelectorAll('main section');
    sections.forEach(section => {
        section.style.display = 'none';
    });

    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.style.display = 'block';
    }
}


// 刪除評論功能
function deleteComment(element) {
    if (confirm("確定要刪除這則評論嗎？")) {
        // 找到按鈕所在的表格行並刪除
        element.closest('tr').remove();
    }
}


//搜尋評論功能
function handleSearchButtonClick() {
    const department = document.getElementById('department').value;
    const instructor = document.getElementById('instructor').value;
    const keyword = document.getElementById('keyword').value;

    if (department === '選擇系所' || instructor.trim() === '' || keyword.trim() === '') {
        alert('輸入資料不完整');
        return window.location.href = 'index.html'; //如果輸入不完整跳回首頁重新輸入
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

// 將首頁搜尋跳轉到course.html頁面，並保留剛剛所選的搜尋條件
function searchCourses() {
    const department = document.getElementById('department').value;
    const instructor = document.getElementById('instructor').value;
    const keyword = document.getElementById('keyword').value;

    const params = new URLSearchParams({ department, instructor, keyword });
    window.location.href = `courses.html?${params.toString()}`;
}
