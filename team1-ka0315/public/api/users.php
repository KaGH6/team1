<?php
header("Access-Control-Allow-Origin: *"); // どのオリジンからでもアクセス許可
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS"); // 許可するメソッド
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // 許可するヘッダー

// OPTIONSリクエストの処理（プリフライトリクエスト対応）
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require 'db.php';
session_start();

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET': // ユーザー取得
        $sql = "SELECT id, name, email FROM users";
        $result = $conn->query($sql);
        $data = [];
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        echo json_encode($data);
        break;

    case 'POST': // ユーザー作成
        $input = json_decode(file_get_contents("php://input"), true);
        $stmt = $conn->prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)");
        $password = password_hash($input["password"], PASSWORD_DEFAULT);
        $stmt->bind_param("sss", $input["name"], $input["email"], $password);
        $stmt->execute();
        echo json_encode(["message" => "ユーザー作成成功"]);
        break;

    case 'PUT': // ユーザー更新
        $input = json_decode(file_get_contents("php://input"), true);
        $stmt = $conn->prepare("UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?");
        $password = password_hash($input["password"], PASSWORD_DEFAULT);
        $stmt->bind_param("sssi", $input["name"], $input["email"], $password, $input["id"]);
        $stmt->execute();
        echo json_encode(["message" => "ユーザー更新成功"]);
        break;

    case 'DELETE': // ユーザー削除
        $input = json_decode(file_get_contents("php://input"), true);
        $stmt = $conn->prepare("DELETE FROM users WHERE id = ?");
        $stmt->bind_param("i", $input["id"]);
        $stmt->execute();
        echo json_encode(["message" => "ユーザー削除成功"]);
        break;
}
$conn->close();
