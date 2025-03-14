document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const checklistId = urlParams.get("checklist_id");

    if (!checklistId) {
        alert("チェックリストが選択されていません。");
        window.location.href = "checklist.html";
        return;
    }

    const addItemButton = document.getElementById("add-item-btn");
    
    addItemButton.addEventListener("click", async function () {
        const itemInput = document.getElementById("item-name");
        const itemName = itemInput.value.trim();

        if (!itemName) {
            alert("アイテム名を入力してください。");
            return;
        }

        try {
            const response = await fetch("http://localhost:8000/api/items.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: itemName, checklist_id: checklistId })
            });

            const result = await response.json();
            alert(result.message);
            window.location.href = `item.html?checklist_id=${checklistId}`;
        } catch (error) {
            console.error("❌ アイテム作成エラー:", error);
            alert("エラーが発生しました。");
        }
    });
});
