document.addEventListener("DOMContentLoaded", function () {
    let userId = localStorage.getItem("user_id");
    let guestId = localStorage.getItem("guest_id");

    const loginTab = document.getElementById("login-tab");
    const signupTab = document.getElementById("signup-tab");
    const logoutBtn = document.getElementById("logout-btn");
    const navTabs = document.getElementById("nav-tabs");
    const categoryList = document.getElementById("category-list");
    const addCategoryBtn = document.getElementById("add-category-btn");

    // 🔹 ログイン済みなら guest_id を削除
    if (userId) {
        if (guestId) {
            console.log("🔹 ログイン済みなので guest_id を削除:", guestId);
            localStorage.removeItem("guest_id");
        }
        guestId = null; // `guestId` を無効化
    } else if (!guestId) {
        guestId = generateGuestId();
        localStorage.setItem("guest_id", guestId);
        console.log("🆕 ゲストIDを作成:", guestId);
    }

    console.log("🔹 現在の認証情報:", { userId, guestId });

    if (userId) {
        // 🔹 ログインユーザーの表示
        logoutBtn.classList.remove("hidden");
        loginTab.style.display = "none";
        signupTab.style.display = "none";
        navTabs.classList.remove("hidden");
        categoryList.classList.remove("hidden");
        addCategoryBtn.classList.remove("hidden");
    } else {
        // 🔹 ゲストユーザーの表示
        logoutBtn.classList.add("hidden");
        loginTab.style.display = "inline-block";
        signupTab.style.display = "inline-block";
        navTabs.classList.remove("hidden");
        categoryList.classList.remove("hidden");
        addCategoryBtn.classList.remove("hidden");
    }

    // 🔹 ログアウト処理
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function (event) {
            event.preventDefault(); // aタグのデフォルト動作を防ぐ
            logoutUser();
        });
    }
});

// 🔹 ログアウト処理
function logoutUser() {
    localStorage.removeItem("user_id"); // ユーザーID削除
    localStorage.removeItem("authToken"); // トークン削除
    localStorage.removeItem("guest_id"); // 🔹 ゲストIDも削除
    alert("ログアウトしました！");
    window.location.href = "category.html"; // category.html に遷移
}

// 🔹 ゲストIDを生成
function generateGuestId() {
    return 'guest-' + Math.random().toString(36).substr(2, 9);
}
