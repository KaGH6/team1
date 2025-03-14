document.addEventListener("DOMContentLoaded", async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryId = urlParams.get("category_id");

    if (!categoryId) {
        alert("カテゴリが選択されていません。");
        window.location.href = "category.html";
        return;
    }

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
                <span>${checklist.name}</span>
                <div class="right-buttons">
                    <button class="edit-button">Edit</button>
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

        // ✅ 削除ボタンのイベントリスナーを `forEach` で適用
        document.querySelectorAll(".delete-button").forEach(button => {
            button.addEventListener("click", async function (event) {
                event.stopPropagation(); // ✅ チェックリストのクリックイベントをキャンセル
                const checklistId = this.getAttribute("data-id");

                if (confirm("このチェックリストを削除しますか？")) {
                    await deleteChecklist(checklistId);
                }
            });
        });

    } catch (error) {
        console.error("❌ チェックリスト取得エラー:", error);
    }
});

// ✅ チェックリスト削除処理
async function deleteChecklist(checklistId) {
    try {
        const response = await fetch("http://localhost:8000/api/checklists.php", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: checklistId })
        });

        const result = await response.json();
        alert(result.message);
        location.reload();
    } catch (error) {
        console.error("❌ チェックリスト削除エラー:", error);
    }
}
