document.addEventListener("DOMContentLoaded", async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryId = urlParams.get("category_id");

    // if (!categoryId) {
    //     alert("カテゴリが選択されていません。");
    //     window.location.href = "category.html";
    //     return;
    // }

    console.log("✅ カテゴリID:", categoryId);

    const checklistContainer = document.querySelector(".category-list");
    const addChecklistButton = document.getElementById("add-checklist-btn");

    // 🔹 `Add Checklist` ボタンのクリックイベントを事前に登録
    addChecklistButton.addEventListener("click", function () {
        window.location.href = `add_checklist.html?category_id=${categoryId}`;
    });

    try {
        const response = await fetch(`http://localhost:8000/api/checklists.php?category_id=${categoryId}`);
        const checklists = await response.json();
        console.log("🛠 チェックリスト取得結果:", checklists);

        checklistContainer.innerHTML = "";

        if (checklists.length === 0) {
            checklistContainer.innerHTML = "<p>チェックリストがありません。</p>";
            return;
        }

        checklists.forEach(checklist => {
            const li = document.createElement("li");
            li.classList.add("checklist-item");
            li.setAttribute("data-id", checklist.id);
            li.innerHTML = `
            <div class="checklist-container">
                <h2>${checklist.name}<br></h2>
                <span class="list-desc">${checklist.description}</span>
                </div>
                <div class="right-buttons">
                    <button class="edit-button" data-id="${checklist.id}">Edit</button>
                    <button class="delete-button" data-id="${checklist.id}">Delete</button>
                </div>
            `;

            checklistContainer.appendChild(li);

            // ✅ クリック時に `item.html` へ遷移
            li.addEventListener("click", function () {
                const checklistId = this.getAttribute("data-id");
                if (checklistId) {
                    window.location.href = `item.html?checklist_id=${checklistId}`;
                }
            });
        });

        // 🔹 編集ボタンのイベントリスナーを追加
        document.querySelectorAll(".edit-button").forEach(button => {
            button.addEventListener("click", function (event) {
                event.stopPropagation(); // ✅ 親要素（カテゴリのクリックイベント）を防ぐ
                const checklistId = this.getAttribute("data-id");
                editChecklist(checklistId);
            });
        });

        // 🔹 削除ボタンのイベントリスナーを追加
        document.querySelectorAll(".delete-button").forEach(button => {
            button.addEventListener("click", function (event) {
                event.stopPropagation(); // ✅ 親要素（カテゴリのクリックイベント）を防ぐ
                const checklistId = this.getAttribute("data-id");
                deleteChecklist(checklistId);
            });
        });

    } catch (error) {
        console.error("❌ チェックリスト取得エラー:", error);
    }
});

// ✅ チェックリスト更新処理
async function editChecklist(checklistId) {
    const newName = prompt("新しいチェックリスト名を入力してください:");
    const newDescription = prompt("新しいチェックリストの説明を入力してください:");
    if (!newName) return;

    try {
        const response = await fetch("http://localhost:8000/api/checklists.php", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: checklistId, name: newName, description: newDescription })
        });

        const result = await response.json();
        if (response.ok) {
            alert("チェックリストが更新されました！");
            location.reload();
        } else {
            alert("チェックリスト更新失敗: " + (result.error || "不明なエラー"));
        }
    } catch (error) {
        console.error("❌ チェックリスト更新エラー:", error);
    }
}

// ✅ チェックリスト削除処理
async function deleteChecklist(checklistId) {
    if (!confirm("このチェックリストを削除しますか？")) return;

    try {
        const response = await fetch("http://localhost:8000/api/checklists.php", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: checklistId })
        });

        const result = await response.json();
        if (response.ok) {
            alert("チェックリストが削除されました！");
            location.reload();
        } else {
            alert("チェックリスト削除失敗: " + (result.error || "不明なエラー"));
        }
    } catch (error) {
        console.error("❌ チェックリスト削除エラー:", error);
    }
}
