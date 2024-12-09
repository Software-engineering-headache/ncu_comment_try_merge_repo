window.addEventListener('DOMContentLoaded', () => {
    fetch('http://127.0.0.1:8000/api/profile', {
        credentials: "include",
    })
        .then(response => response.json())
        .then(data => {
            document.getElementById('accountType').value = data.accountType;
            document.getElementById('chineseName').value = data.chineseName;
            document.getElementById('englishName').value = data.englishName;
            document.getElementById('gender').value = data.gender;
            document.getElementById('birthday').value = data.birthday;
            document.getElementById('studentId').value = data.studentId;
            document.getElementById('email').value = data.email;
        })
        .catch(error => console.error('Error fetching profile:', error));
});