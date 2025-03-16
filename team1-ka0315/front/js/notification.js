document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ リマインダー通知スクリプト開始");

    function checkReminders() {
        fetch("http://localhost:8000/api/reminders.php")
            .then(response => response.json())
            .then(reminders => {
                console.log("🛠 取得したリマインダー:", reminders);

                reminders.forEach(reminder => {
                    alert(`🔔 リマインダー: ${reminder.name}\n時間になりました！`);
                });
            })
            .catch(error => console.error("❌ リマインダー取得エラー:", error));
    }

    // 🔹 初回実行
    checkReminders();

    // 🔹 30秒ごとにリマインダーをチェック（不要なら削除可）
    setInterval(checkReminders, 1000);
});