const API_URL = "http://127.0.0.1:8000/courses/results";

document.addEventListener('DOMContentLoaded', initializeSearchButton);

function initializeSearchButton() {
    const searchButton = document.getElementById('searchButton');
    if (searchButton) {
        searchButton.addEventListener('click',searchCourses);
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
    //使用假資料顯示結果
    // const fakeData = [
    //    { department: '資訊管理學系', courseCode: '43030', courseName: '軟體工程 I', instructor: '張三', reviewCount: 2 },
    //    { department: '資訊工程學系', courseCode: '43039', courseName: '企業電腦網路', instructor: '李四', reviewCount: 1 }
    //];
    //showSearchResults(fakeData);

    fetch(`${API_URL}?department=${params.department}&instructor=${params.instructor}&keyword=${params.keyword}`)
    .then(response => {
        return response.json(); // 確保將回應轉為 JSON
    })
    .then(data => {
        const courseListBody = document.getElementById('courseListBody');
        console.log('Received Data:', data); 
        
        // 檢查資料是否為空或所有值均為 null
        if (!data || data.length === 0 || data.every(item => Object.values(item).every(value => value === null))) {
        // 清空搜尋結果並顯示 "無結果" 提示
            courseListBody.innerHTML = '';
            document.getElementById('noneresult').style.display = 'inline';
            return;
        }

        // 有結果時，隱藏 "無結果" 提示，顯示結果
        document.getElementById('noneresult').style.display = 'none';
        showSearchResults(data);
    })
    .catch(error => {
        console.error('Error fetching search results:', error);
        // 如果發生錯誤，顯示 "無結果" 提示
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
        } else {
            // 處理教授列表（將陣列轉為以逗號分隔的字串）
            const professors = result.professors.join(', ');
            
            // 動態填充資料
            row.innerHTML = `
                <td>${result.department_name}</td>
                <td>${result.course_id}</td>
                <td>${result.course_name}</td>
                <td>${professors}</td>
                <td>${result.count}</td>
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
            

         
