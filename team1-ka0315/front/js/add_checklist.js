document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryId = urlParams.get("category_id");

    if (!categoryId) {
        alert("カテゴリが選択されていません。");
        window.location.href = "category.html";
        return;
    }

    console.log("✅ 受け取ったカテゴリID:", categoryId);

    const addChecklistButton = document.getElementById("add-checklist-btn");

    addChecklistButton.addEventListener("click", async function () {
        const name = document.getElementById("checklist-name").value.trim();
        const description = document.getElementById("checklist-description").value.trim();
        const reminderTime = document.getElementById("reminder-time").value.trim();

        if (!name) {
            alert("チェックリストの名前を入力してください。");
            return;
        }

        let requestData = {
            name: name,
            description: description,
            category_id: categoryId,
            reminder_at: reminderTime,
        };

        try {
            const response = await fetch("http://localhost:8000/api/checklists.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestData),
            });

            const text = await response.text(); // 🔍 まずテキスト形式でレスポンスを取得
            console.log("🛠 サーバーレスポンス（テキスト）:", text);

            try {
                const result = JSON.parse(text); // 🔍 JSON に変換
                console.log("🛠 サーバーレスポンス（JSON）:", result);

                if (response.ok) {
                    alert("チェックリストが作成されました！");
                    window.location.href = `checklist.html?category_id=${categoryId}`;
                } else {
                    alert("❌ チェックリスト作成失敗: " + (result.error || "不明なエラー"));
                }
            } catch (jsonError) {
                console.error("❌ JSON パースエラー:", jsonError);
                alert("❌ サーバーエラー: 不正なレスポンスが返されました。");
            }
        } catch (error) {
            console.error("❌ チェックリスト作成エラー:", error);
            alert("❌ ネットワークエラーが発生しました。");
        }
    });
});
