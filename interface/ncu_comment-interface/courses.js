const API_URL = "http://127.0.0.1:8000/courses/results";

document.addEventListener('DOMContentLoaded', initializeSearchButton);

function initializeSearchButton() {
    const searchButton = document.getElementById('searchButton');
    if (searchButton) {
        searchButton.addEventListener('click');
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    const params = getQueryParams();
    if (!params.department && !params.instructor && !params.keyword) {
        return 0;
    }
    else {
        fillForm(params);   
        fetchSearchResults(params);
    }
});   

// 解析 URL 參數
function getQueryParams() {
    const params = new URLSearchParams(window.location.search);  //URLSearchParams是一個內建的物件，用來處理URL查詢字串，例如：?name=abc&age=20
    return {
        department: params.get('department'),
        instructor: params.get('instructor'),
        keyword: params.get('keyword')
    };// 會回傳一個物件，裡面有三個屬性，分別是department、instructor、keyword
} //這個 getQueryParams 的結果會丟回去最底下初始化           

function searchCourses() {
    const department = document.getElementById('department').value;
    const instructor = document.getElementById('instructor').value;
    const keyword = document.getElementById('keyword').value;

    if (department === '選擇系所' || instructor.trim() === '' || keyword.trim() === '') {
        alert('輸入資料不完整');
        return window.location.href = 'courses.html';
    }
    else{
        const params = { department: department, instructor: instructor, keyword: keyword };
        fetchSearchResults(params);
    }
}

// 填充表單
function fillForm(params) {
    document.getElementById('department').value = params.department || '選擇系所';
    document.getElementById('instructor').value = params.instructor || '';
    document.getElementById('keyword').value = params.keyword || '';
}            

// 調用 API 獲取搜尋結果
function fetchSearchResults(params) {
    // 使用假資料顯示結果
    // const fakeData = [
    //    { department: '資訊管理研究所', courseCode: '43030', courseName: '軟體工程 I', instructor: '張三', reviewCount: 2 },
    //    { department: '資訊工程研究所', courseCode: '43039', courseName: '企業電腦網路', instructor: '李四', reviewCount: 1 }
    //];
    //showSearchResults(fakeData);

    fetch(`${API_URL}?department=${params.department}&instructor=${params.instructor}&keyword=${params.keyword}`)
        .then(response => response.json())  // 確保將響應轉換為 JSON
        .then(data => {
            // 檢查資料是否為空陣列或包含 null 的值
            if (!data || data.length === 0 || data.every(item => Object.values(item).every(value => value === null))) {
                // 如果沒有結果，顯示 "無結果" 提示
                const courseListBody = document.getElementById('courseListBody');
                courseListBody.innerHTML = ''; // 清空搜尋結果
            }
            else {
                showSearchResults(data);
            }
        })
        .catch(error => {
            console.error('Error fetching search results:', error);
            document.getElementById('noneresult').style.display = 'inline';
        });
}

// 顯示搜尋結果
function showSearchResults(results) {
    const courseListBody = document.getElementById('courseListBody');
    courseListBody.innerHTML = '';
        results.forEach(result => {
            const row = document.createElement('tr');
            if (result.department_name === null ) { 
                document.getElementById('noneresult').style.display = 'inline';
                document.getElementById('noneresult2').style.display = 'none';
            }
            else {
                row.innerHTML = `
                    <td>${result.department_name}</td>
                    <td>${result.course_id}</td>
                    <td>${result.course_name}</td>
                    <td>${result.professor_name}</td>
                    <td>${result.comment_count}</td>
                    <td>
                        <button class="btn" onclick="window.location.href='newCommentv2.html'">查看評論</button>
                        <button class="btn">加入收藏</button>
                    </td>
                `;
                courseListBody.appendChild(row);
                document.getElementById('courseList').style.display = 'block';
            }

        });
}
        
function viewComments(courseName) {
    window.location.href = `newCommentv2.html?course_name=${encodeURIComponent(courseName)}`;
}
            

         
