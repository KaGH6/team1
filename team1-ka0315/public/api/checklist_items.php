<?php
require 'db.php';
session_start();

if (!isset($_SESSION["guest_id"]) && !isset($_SESSION["user_id"])) {
    $_SESSION["guest_id"] = session_id();
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET': // アイテム取得（チェックリストIDで絞り込む）
        $checklist_id = $_GET['checklist_id'] ?? null;
        if ($checklist_id) {
            $stmt = $conn->prepare("SELECT * FROM checklist_items WHERE checklist_id = ?");
            $stmt->bind_param("i", $checklist_id);
            $stmt->execute();
            $result = $stmt->get_result();
            $data = [];
            while ($row = $result->fetch_assoc()) {
                $data[] = $row;
            }
            echo json_encode($data);
        } else {
            echo json_encode(["error" => "チェックリストIDが指定されていません"]);
        }
        break;

    case 'POST': // アイテム追加
        $input = json_decode(file_get_contents("php://input"), true);
        if (!isset($input["checklist_id"], $input["name"], $input["status"])) {
            echo json_encode(["error" => "必要なデータが不足しています"]);
            exit;
        }

        $stmt = $conn->prepare("INSERT INTO checklist_items (checklist_id, name, checked) VALUES (?, ?, ?)");
        $stmt->bind_param("isi", $input["checklist_id"], $input["name"], $input["status"] ? 1 : 0);
        $stmt->execute();
        echo json_encode(["message" => "アイテム作成成功"]);
        break;

    case 'PUT': // アイテム更新
        $input = json_decode(file_get_contents("php://input"), true);
        if (!isset($input["id"], $input["name"], $input["status"])) {
            echo json_encode(["error" => "必要なデータが不足しています"]);
            exit;
        }

        $stmt = $conn->prepare("UPDATE checklist_items SET name = ?, checked = ? WHERE id = ?");
        $stmt->bind_param("sii", $input["name"], $input["status"] ? 1 : 0, $input["id"]);
        $stmt->execute();
        echo json_encode(["message" => "アイテム更新成功"]);
        break;

    case 'DELETE': // アイテム削除
        $input = json_decode(file_get_contents("php://input"), true);
        if (!isset($input["id"])) {
            echo json_encode(["error" => "IDが指定されていません"]);
            exit;
        }

        $stmt = $conn->prepare("DELETE FROM checklist_items WHERE id = ?");
        $stmt->bind_param("i", $input["id"]);
        $stmt->execute();
        echo json_encode(["message" => "アイテム削除成功"]);
        break;
}
$conn->close();
