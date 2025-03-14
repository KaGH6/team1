document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ スクリプト開始");

    // 🔹 ローカルストレージからログイン情報を取得
    let userId = localStorage.getItem("user_id");
    let guestId = localStorage.getItem("guest_id");

    // 🔹 ログインユーザーの場合、guest_id を削除
    if (userId && guestId) {
        console.log("🔹 ログイン済みなので guest_id を削除:", guestId);
        localStorage.removeItem("guest_id");
        guestId = null;
    }

    console.log("user_id:", userId);
    console.log("guest_id:", guestId);

    const addCategoryButton = document.getElementById("add-category-btn");

    addCategoryButton.addEventListener("click", async function () {
        const categoryInput = document.getElementById("category-name");
        const categoryName = categoryInput.value.trim();

        if (!categoryName) {
            alert("カテゴリ名を入力してください。");
            return;
        }

        let requestData = { name: categoryName };

        if (userId) {
            requestData.user_id = parseInt(userId, 10);  // 🔹 ログインユーザーのIDを送信
        } else if (guestId) {
            requestData.guest_id = guestId;  // 🔹 ゲストIDを送信
        } else {
            alert("ログインするか、ゲストモードで開始してください。");
            window.location.href = "login.html";
            return;
        }

        try {
            const response = await fetch("http://localhost:8000/api/categories.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestData),
                mode: "cors"
            });

            const text = await response.text();
            console.log("🛠 サーバーレスポンス:", text);

            const result = JSON.parse(text);

            if (response.ok) {
                alert("カテゴリが作成されました！");
                window.location.href = "category.html";
            } else {
                alert("カテゴリ作成失敗: " + (result.error || "不明なエラー"));
            }
        } catch (error) {
            console.error("カテゴリ作成エラー:", error);
            alert("エラーが発生しました。");
        }
    });
});
