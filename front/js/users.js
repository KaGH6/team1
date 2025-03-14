document.addEventListener("DOMContentLoaded", function () {
    loadUsers();

        document.getElementById("signup-form").addEventListener("submit", function (event) {
        event.preventDefault();
        signupUser();
    });

    // document.getElementById("guest-btn").addEventListener("click", function () {
    //     guestLogin();
    // });

    // document.getElementById("update-user-btn").addEventListener("click", function () {
    //     updateUser();
    // });

    // document.getElementById("delete-user-btn").addEventListener("click", function () {
    //     deleteUser();
    // });
});

// 🔹 全ユーザーを取得（GET）
async function loadUsers() {
    try {
        const res = await fetch("http://localhost:8000/api/users.php");
        const data = await res.json();
        console.log("ユーザー一覧:", data);
    } catch (error) {
        console.error("ユーザー一覧取得エラー:", error);
    }
}

// 🔹 ユーザー登録（POST）
async function signupUser() {
    let formData = {
        name: document.getElementById("signup-username").value,
        email: document.getElementById("signup-email").value,
        password: document.getElementById("signup-password").value
    };

    console.log("送信データ:", formData); // 🔹 ここで値を確認

    try {
        const res = await fetch("http://localhost:8000/api/users.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        });
        const data = await res.json();

        if (data.message) {
            alert("ユーザー登録成功！ログインしてください。");
            window.location.href = "../html/login.html";
        } else {
            alert("ユーザー登録失敗: " + data.error);
        }
    } catch (error) {
        console.error("ユーザー登録エラー:", error);
    }
}

// // 🔹 ゲストログイン（POST）
// async function guestLogin() {
//     try {
//         const res = await fetch("http://localhost/api/users.php", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ action: "guest_login" })
//         });
//         const data = await res.json();

//         if (data.guest_id) {
//             localStorage.setItem("guestId", data.guest_id);
//             alert("ゲストとしてログインしました！");
//             window.location.href = "category.html";
//         } else {
//             alert("ゲストログイン失敗");
//         }
//     } catch (error) {
//         console.error("ゲストログインエラー:", error);
//     }
// }

// // 🔹 ユーザー情報を更新（PUT）
// async function updateUser() {
//     let formData = {
//         action: "update",
//         id: document.getElementById("update-user-id").value,
//         username: document.getElementById("update-username").value,
//         email: document.getElementById("update-email").value,
//         password: document.getElementById("update-password").value
//     };

//     try {
//         const res = await fetch("http://localhost/api/users.php", {
//             method: "PUT",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify(formData)
//         });
//         const data = await res.json();

//         if (data.message) {
//             alert("ユーザー情報更新成功！");
//         } else {
//             alert("更新失敗: " + data.error);
//         }
//     } catch (error) {
//         console.error("ユーザー情報更新エラー:", error);
//     }
// }

// // 🔹 ユーザー削除（DELETE）
// async function deleteUser() {
//     let userId = document.getElementById("delete-user-id").value;

//     if (!confirm("本当に削除しますか？")) return;

//     try {
//         const res = await fetch("http://localhost/api/users.php", {
//             method: "DELETE",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ action: "delete", id: userId })
//         });
//         const data = await res.json();

//         if (data.message) {
//             alert("ユーザー削除成功！");
//             loadUsers(); // 最新のユーザー一覧を取得
//         } else {
//             alert("削除失敗: " + data.error);
//         }
//     } catch (error) {
//         console.error("ユーザー削除エラー:", error);
//     }
// }
