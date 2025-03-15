document.addEventListener("DOMContentLoaded", function () {
        document.getElementById("login-form").addEventListener("submit", function (event) {
        event.preventDefault();
        loginUser();
    });
});

// // 🔹 ログイン処理（POST）
async function loginUser() {
    let formData = {
        name: document.getElementById("login-username").value,
        password: document.getElementById("login-password").value
    };

    try {
        const res = await fetch("http://localhost:8000/api/login.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        });
        const data = await res.json();

        if (data.user_id) {
            localStorage.setItem("user_id", data.user_id);
            alert("ログイン成功！");
            window.location.href = "category.html"; // 次のページへ
        } else {
            alert("ログイン失敗: " + data.error);
        }
    } catch (error) {
        console.error("ログインエラー:", error);
    }
}
