window.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:8000/my_comments', {
        credentials: 'include'  // 确保请求包含凭据（如 Cookie）
    })
        .then(response => response.json())
        .then(data => {
            console.log('Received data:', data);  // 输出接收到的数据

            const tbody = document.getElementById('comments-body');

            if (data.error) {
                tbody.innerHTML = `<tr><td colspan="4">${data.error}</td></tr>`;
                return;
            }

            data.forEach(comment => {
                const row = document.createElement('tr');

                // 課程代碼
                const courseIdCell = document.createElement('td');
                courseIdCell.textContent = comment.course_id;
                row.appendChild(courseIdCell);

                // 課程名稱
                const courseNameCell = document.createElement('td');
                courseNameCell.textContent = comment.course_name;
                row.appendChild(courseNameCell);

                // 評論內容
                const contentCell = document.createElement('td');
                contentCell.textContent = comment.content;
                row.appendChild(contentCell);

                // 刪除按鈕
                const deleteCell = document.createElement('td');
                const deleteButton = document.createElement('button');
                deleteButton.className = 'btn';
                deleteButton.textContent = '刪除';
                deleteButton.onclick = function () {
                    deleteComment(this, comment.course_id);
                };
                deleteCell.appendChild(deleteButton);
                row.appendChild(deleteCell);

                tbody.appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching comments:', error));
});

function deleteComment(button, courseId) {
    // 實現刪除邏輯，例如發送 DELETE 請求到後端
}