<?php
require 'db.php';
session_start();

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$input = json_decode(file_get_contents("php://input"), true);
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $checklistId = $_GET["checklist_id"] ?? null;
        if (!$checklistId) {
            echo json_encode(["error" => "チェックリストIDが指定されていません"]);
            exit();
        }
        
        $stmt = $conn->prepare("SELECT * FROM items WHERE checklist_id = ?");
        $stmt->bind_param("i", $checklistId);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $data = [];
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        echo json_encode($data);
        break;
    
    case 'POST':
        $input = json_decode(file_get_contents("php://input"), true);
        if (!isset($input["name"], $input["checklist_id"])) {
            echo json_encode(["error" => "必要なデータが不足しています"]);
            exit();
        }
        
        $stmt = $conn->prepare("INSERT INTO items (name, checklist_id, checked) VALUES (?, ?, false)");
        $stmt->bind_param("si", $input["name"], $input["checklist_id"]);
        $stmt->execute();
        
        echo json_encode(["message" => "アイテム作成成功"]);
        break;
    
    
        case 'PUT': // アイテム更新
            $input = json_decode(file_get_contents("php://input"), true);
            if (!isset($input["id"])) {
                echo json_encode(["error" => "アイテムIDが指定されていません"]);
                exit();
            }
    
            $updateFields = [];
            $bindTypes = "";
            $bindValues = [];
    
            if (isset($input["name"])) {
                $updateFields[] = "name = ?";
                $bindTypes .= "s";
                $bindValues[] = $input["name"];
            }
            if (isset($input["checked"])) {
                $updateFields[] = "checked = ?";
                $bindTypes .= "i";
                $bindValues[] = $input["checked"];
            }
    
            if (count($updateFields) === 0) {
                echo json_encode(["error" => "更新するデータがありません"]);
                exit();
            }
    
            $bindTypes .= "i";
            $bindValues[] = $input["id"];
            $updateQuery = "UPDATE items SET " . implode(", ", $updateFields) . " WHERE id = ?";
            $stmt = $conn->prepare($updateQuery);
            $stmt->bind_param($bindTypes, ...$bindValues);
            $stmt->execute();
    
            echo json_encode(["message" => "アイテム更新成功"]);
            break;
    
    case 'DELETE':
        $input = json_decode(file_get_contents("php://input"), true);
        if (!isset($input["id"])) {
            echo json_encode(["error" => "IDが指定されていません"]);
            exit();
        }
        
        $stmt = $conn->prepare("DELETE FROM items WHERE id = ?");
        $stmt->bind_param("i", $input["id"]);
        $stmt->execute();
        
        echo json_encode(["message" => "アイテム削除成功"]);
        break;
}
$conn->close();
