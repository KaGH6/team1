<?php
require '../includes/db.php';  // db.php を読み込む

// 接続が成功しているか確認
if ($conn->connect_error) {
    die("データベース接続失敗: " . $conn->connect_error);
} else {
    echo "データベース接続成功！";
}

// データを取得して確認
$sql = "SELECT '接続テスト成功！' AS message";
$result = $conn->query($sql);

if ($result) {
    $row = $result->fetch_assoc();
    echo "<br>" . $row['message']; // 「接続テスト成功！」と表示
} else {
    echo "<br>SQLクエリ実行エラー";
}

// 接続を閉じる
$conn->close();
