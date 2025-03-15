<?php
require 'db.php';

// 🔹 現在の時刻
$currentTimestamp = date("Y-m-d H:i:s");

// 🔹 送信対象のチェックリストを取得
$stmt = $conn->prepare("SELECT c.id, c.name, u.email FROM checklists c
    LEFT JOIN users u ON c.user_id = u.id
    WHERE c.reminder_at <= ? AND c.reminder_at IS NOT NULL");

$stmt->bind_param("s", $currentTimestamp);
$stmt->execute();
$result = $stmt->get_result();

while ($row = $result->fetch_assoc()) {
    $email = $row["email"];
    $checklistName = $row["name"];

    if ($email) {
        $subject = "【リマインダー】チェックリストの通知";
        $message = "あなたのチェックリスト「{$checklistName}」のリマインダー時刻になりました！";
        $headers = "From: no-reply@wasuren.com";

        mail($email, $subject, $message, $headers);
        error_log("📩 メール送信: {$email} - {$checklistName}");
    }
}

// 🔹 リマインダー送信済みのものを削除（オプション）
$stmt = $conn->prepare("UPDATE checklists SET reminder_at = NULL WHERE reminder_at <= ?");
$stmt->bind_param("s", $currentTimestamp);
$stmt->execute();

$conn->close();
