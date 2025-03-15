<?php
require 'db.php';
session_start(); // セッションを開始

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// OPTIONSリクエストの処理（プリフライトリクエスト対応）
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// 🔹 POST メソッドのみ処理
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents("php://input"), true);

    if (!isset($input["name"], $input["password"])) {
        echo json_encode(["error" => "必要なデータが不足しています"]);
        exit();
    }

    $username = $input["name"];
    $password = $input["password"];

    // 🔹 ユーザー検索
    $stmt = $conn->prepare("SELECT id, name, password FROM users WHERE name = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();

    if ($user && password_verify($password, $user["password"])) {
        // ✅ `user_id` をセッションに保存（重要！）
        $_SESSION["id"] = $user["id"];

        // ✅ セッションIDを `authToken` として使用
        $_SESSION["authToken"] = session_id();

        echo json_encode([
            "message" => "ログイン成功",
            "user_id" => $user["id"], 
            "token" => $_SESSION["authToken"]
        ]);
    } else {
        echo json_encode(["error" => "ユーザー名またはパスワードが間違っています"]);
    }
}

$conn->close();
?>
