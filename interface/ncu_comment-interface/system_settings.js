const PROFILE_URL = "http://localhost:8000/api/profile"; // 請依實際情況修改
let currentStudentId = null;

// 檢查登入狀態並取得 studentId
async function checkLoginStatus() {
    try {
        const profileResponse = await fetch(PROFILE_URL, {
            credentials: "include",
        });

        if (!profileResponse.ok) {
            // 未登入或取得資料失敗
            currentStudentId = null;
            return false;
        }

        const profileData = await profileResponse.json();
        if (profileData.studentId) {
            currentStudentId = profileData.studentId;
            return true;
        } else {
            currentStudentId = null;
            return false;
        }
    } catch (error) {
        console.error("檢查登入狀態失敗:", error);
        currentStudentId = null;
        return false;
    }
}

document.getElementById("save-settings-btn").addEventListener("click", async () => {
    const charCountInput = document.getElementById("comment-limit");
    const actionInput = document.getElementById("system-log");

    const charCountValue = charCountInput.value.trim();
    const actionValue = actionInput.value.trim();

    // 檢查是否已登入
    const loggedIn = await checkLoginStatus();
    if (!loggedIn || !currentStudentId) {
        alert("您尚未登入，請先登入後再試！");
        return;
    }

    // 1. 檢查評論字數上限是否為空
    if (!charCountValue) {
        alert("字數上限欄位不可為空白！");
        return;
    }

    // 將字數上限轉為數字型態
    const charCountNumber = parseInt(charCountValue, 10);
    if (isNaN(charCountNumber)) {
        alert("字數上限欄位必須為數字！");
        return;
    }

    // 組裝要傳給後端的資料，多加上 admin_id 欄位
    const payload = {
        char_count: charCountNumber,
        action: actionValue === "" ? null : actionValue,
        admin_id: currentStudentId  // 新增這行，將使用者學號一併傳回後端
    };

    try {
        const response = await fetch("http://127.0.0.1:8000/settings/save", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json();
            alert(`儲存失敗：${errorData.detail || "未知錯誤"}`);
            return;
        }

        const data = await response.json();
        alert(data.message || "設定已儲存成功！");
        
        // 儲存成功後可清空備註欄位
        actionInput.value = "";
    } catch (error) {
        console.error("Error:", error);
        alert("儲存失敗，請稍後再試！");
    }
});
