document.addEventListener("DOMContentLoaded", async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const checklistId = urlParams.get("checklist_id");
    // if (!checklistId) {
    //     alert("チェックリストが選択されていません。");
    //     window.location.href = "checklist.html";
    //     return;
    // }

    const itemContainer = document.querySelector(".item-list");
    const addItemButton = document.getElementById("add-item-btn");

    addItemButton.addEventListener("click", function () {
        window.location.href = `add_item.html?checklist_id=${checklistId}`;
    });

    try {
        const response = await fetch(`http://localhost:8000/api/items.php?checklist_id=${checklistId}`);
        const items = await response.json();

        itemContainer.innerHTML = "";

        if (items.length === 0) {
            itemContainer.innerHTML = "<p>アイテムがありません。</p>";
            return;
        }

        items.forEach(item => {
            const li = document.createElement("li");
            li.classList.add("item");
            li.setAttribute("data-id", item.id);
            li.innerHTML = `
             <div class="item-container">
                <input type="checkbox" class="check-item" data-id="${item.id}" ${item.checked ? "checked" : ""}>
                <span>${item.name}</span>
                </div>
                <div class="item-buttons">
                <button class="edit-button" data-id="${item.id})">Edit</button>
                <button class="delete-button" data-id="${item.id}">Delete</button>
                </div>
            `;
            itemContainer.appendChild(li);
        });

        document.querySelectorAll(".check-item").forEach(checkbox => {
            checkbox.addEventListener("change", async function () {
                const itemId = this.getAttribute("data-id");
                const isChecked = this.checked ? 1 : 0;

                await fetch("http://localhost:8000/api/items.php", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id: itemId, checked: isChecked })
                });
            });
        });

        document.querySelectorAll(".edit-button").forEach(button => {
            button.addEventListener("click", function (event) {
                event.stopPropagation(); // ✅ 親要素（カテゴリのクリックイベント）を防ぐ
                const itemId = this.getAttribute("data-id");
                editItem(itemId);
            });
        });

        async function editItem(itemId) {
            const newName = prompt("新しいアイテム名を入力してください:");
            if (!newName) return;

            try {
                const response = await fetch("http://localhost:8000/api/items.php", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id: itemId, name: newName })
                });

                const result = await response.json();
                if (response.ok) {
                    alert("アイテムが更新されました！");
                    location.reload();
                } else {
                    alert("アイテム更新失敗: " + (result.error || "不明なエラー"));
                }
            } catch (error) {
                console.error("❌ アイテム更新エラー:", error);
            }
        }

        document.querySelectorAll(".delete-button").forEach(button => {
            button.addEventListener("click", async function () {
                const itemId = this.getAttribute("data-id");
                if (confirm("このアイテムを削除しますか？")) {
                    await fetch("http://localhost:8000/api/items.php", {
                        method: "DELETE",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ id: itemId })
                    });
                    location.reload();
                }
            });
        });
    } catch (error) {
        console.error("❌ アイテム取得エラー:", error);
    }
});
