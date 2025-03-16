<?php
require 'db.php';
date_default_timezone_set("Asia/Tokyo"); // 日本時間を設定

// 🔹 現在時刻を取得
$current_time = date("Y-m-d H:i:s");

// 🔹 未通知 (seen = FALSE) かつ 期限を過ぎたリマインダーを取得
$stmt = $conn->prepare("
    SELECT id, name 
    FROM checklists 
    WHERE reminder_at <= ? 
    AND reminder_at IS NOT NULL
    AND seen = FALSE
");
$stmt->bind_param("s", $current_time);
$stmt->execute();
$result = $stmt->get_result();

$reminders = [];
while ($row = $result->fetch_assoc()) {
    $reminders[] = $row;
}

// 🔹 取得したリマインダーを seen = TRUE に更新（通知済みにする）
if (!empty($reminders)) {
    $updateStmt = $conn->prepare("UPDATE checklists SET seen = TRUE WHERE id = ?");
    foreach ($reminders as $reminder) {
        $updateStmt->bind_param("i", $reminder['id']);
        $updateStmt->execute();
    }
}

echo json_encode($reminders);
