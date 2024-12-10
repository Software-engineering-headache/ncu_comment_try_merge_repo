async function logout() {
    try {
        const response = await fetch('http://localhost:8000/interface/ncu_comment-interface/logout', {
            credentials: 'include', // 確保 Cookie 被自動帶上
        });
        if (response.ok) {
            console.log('登出成功');
            window.location.href = 'http://localhost:8000/interface/ncu_comment-interface/login'; // 登出後跳轉到登入頁面
        } else {
            console.error('登出失敗');
        }
    } catch (error) {
        console.error('登出請求失敗：', error);
    }
}