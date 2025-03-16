<?php
require 'db.php';
session_start();

// CORS 設定
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// OPTIONSリクエストの処理（プリフライトリクエスト対応）
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ゲストの識別IDをセット
if (!isset($_SESSION["guest_id"]) && !isset($_SESSION["user_id"])) {
    $_SESSION["guest_id"] = session_id();
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET': // 🔹 チェックリスト取得（ゲスト or ユーザー）
        $categoryId = $_GET["category_id"] ?? null;

        if (!$categoryId) {
            echo json_encode(["error" => "カテゴリIDが指定されていません"]);
            exit();
        }

        $stmt = $conn->prepare("SELECT * FROM checklists WHERE category_id = ?");
        $stmt->bind_param("i", $categoryId);

        $stmt->execute();
        $result = $stmt->get_result();
        $data = [];
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        echo json_encode($data);
        break;

    case 'POST': // 🔹 チェックリスト作成
        $input = json_decode(file_get_contents("php://input"), true);

        if (!isset($input["name"], $input["category_id"])) {
            echo json_encode(["error" => "必須フィールドが不足しています"]);
            exit();
        }

        $name = $input["name"];
        $description = $input["description"] ?? "";
        $categoryId = $input["category_id"];
        $reminderAt = $input["reminder_at"] ?? null;
        if ($reminderAt === "" || empty($reminderAt)) {
            $reminderAt = null;
        } else {
            $reminderAt = date("Y-m-d H:i:s", strtotime($reminderAt));
        }

        $stmt = $conn->prepare("INSERT INTO checklists (name, description, category_id, reminder_at) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("ssis", $name, $description, $categoryId, $reminderAt);

        $stmt->execute();
        echo json_encode(["message" => "チェックリスト作成成功"]);
        break;

    case 'PUT': // チェックリスト更新
        $input = json_decode(file_get_contents("php://input"), true);
        if (!isset($input["id"], $input["name"], $input["description"])) {
            echo json_encode(["error" => "必要なデータが不足しています"]);
            exit;
        }

        $stmt = $conn->prepare("UPDATE checklists SET name = ?, description = ? WHERE id = ?");
        $stmt->bind_param("ssi", $input["name"], $input["description"], $input["id"]);

        $stmt->execute();
        echo json_encode(["message" => "チェックリスト更新成功"]);
        break;

    case 'DELETE': // チェックリスト削除
        $input = json_decode(file_get_contents("php://input"), true);
        if (!isset($input["id"])) {
            echo json_encode(["error" => "IDが指定されていません"]);
            exit;
        }
        $stmt = $conn->prepare("DELETE FROM checklists WHERE id = ?");
        $stmt->bind_param("i", $input["id"]);
        $stmt->execute();
        echo json_encode(["message" => "チェックリスト削除成功"]);
        break;
}

$conn->close();
