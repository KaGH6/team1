document.addEventListener("DOMContentLoaded", async function () {
    console.log("✅ カテゴリ一覧スクリプト開始");

    // 🔹 ローカルストレージからログイン情報を取得
    let userId = localStorage.getItem("user_id");
    let guestId = localStorage.getItem("guest_id");

    // 🔹 ログインユーザーの場合、guest_id を削除
    if (userId && guestId) {
        console.log("🔹 ログイン済みなので guest_id を削除:", guestId);
        localStorage.removeItem("guest_id");
        guestId = null;
    }

    console.log("🔹 認証情報:", { userId, guestId });

    let url = "http://localhost:8000/api/categories.php";
    let params = new URLSearchParams();

    if (userId) {
        params.append("user_id", userId); // 🔹 ログインユーザーのカテゴリを取得
    } else if (guestId) {
        params.append("guest_id", guestId); // 🔹 ゲストのカテゴリを取得
    } else {
        console.log("⚠ ユーザーが未認証（ログインもゲストもなし）");
        return;
    }

    try {
        const response = await fetch(`${url}?${params.toString()}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            mode: "cors"
        });

        const text = await response.text();
        console.log("🛠 サーバーレスポンス:", text);

        const data = JSON.parse(text);

        if (response.ok) {
            console.log("✅ カテゴリ一覧取得成功:", data);
            displayCategories(data);
        } else {
            console.error("カテゴリ取得エラー:", data.error || "不明なエラー");
        }
    } catch (error) {
        console.error("カテゴリ取得エラー:", error);
    }
});

// 🔹 カテゴリをHTMLに表示する関数
function displayCategories(categories) {
    const categoryList = document.getElementById("category-list");
    categoryList.innerHTML = ""; // 一度リストをクリア

    categories.forEach(category => {
        const listItem = document.createElement("li");
        listItem.classList.add("category-item");
        listItem.setAttribute("data-id", category.id); // 🔹 カテゴリIDをセット

        listItem.innerHTML = `
            <span>${category.name}</span>
            <div class="right-buttons">
                <button class="edit-button" onclick="editCategory(${category.id})">Edit</button>
                <button class="delete-button" onclick="deleteCategory(${category.id})">Delete</button>
            </div>
        `;

        // 🔹 カテゴリをクリックすると、そのカテゴリの `id` を `checklist.html` に渡して遷移
        listItem.addEventListener("click", function () {
            const categoryId = this.getAttribute("data-id");
            window.location.href = `checklist.html?category_id=${categoryId}`;
        });

        categoryList.appendChild(listItem);
    });
}
