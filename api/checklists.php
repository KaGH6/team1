<?php
require 'db.php';
session_start();

// ゲストの識別IDをセット
if (!isset($_SESSION["guest_id"]) && !isset($_SESSION["user_id"])) {
    $_SESSION["guest_id"] = session_id();
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET': // チェックリスト取得
        if (isset($_SESSION["user_id"])) {
            $stmt = $conn->prepare("SELECT * FROM checklists WHERE user_id = ?");
            $stmt->bind_param("i", $_SESSION["user_id"]);
        } else {
            $stmt = $conn->prepare("SELECT * FROM checklists WHERE guest_id = ?");
            $stmt->bind_param("s", $_SESSION["guest_id"]);
        }

        $stmt->execute();
        $result = $stmt->get_result();
        $data = [];
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        echo json_encode($data);
        break;

    case 'POST': // チェックリスト作成
        $input = json_decode(file_get_contents("php://input"), true);
        if (!isset($input["name"], $input["description"])) {
            echo json_encode(["error" => "必要なデータが不足しています"]);
            exit;
        }

        if (isset($_SESSION["user_id"])) {
            $stmt = $conn->prepare("INSERT INTO checklists (name, description, user_id) VALUES (?, ?, ?)");
            $stmt->bind_param("ssi", $input["name"], $input["description"], $_SESSION["user_id"]);
        } else {
            $stmt = $conn->prepare("INSERT INTO checklists (name, description, guest_id) VALUES (?, ?, ?)");
            $stmt->bind_param("sss", $input["name"], $input["description"], $_SESSION["guest_id"]);
        }

        $stmt->execute();
        echo json_encode(["message" => "チェックリスト作成成功"]);
        break;

    case 'PUT': // チェックリスト更新
        $input = json_decode(file_get_contents("php://input"), true);
        if (!isset($input["id"], $input["name"], $input["description"])) {
            echo json_encode(["error" => "必要なデータが不足しています"]);
            exit;
        }

        if (isset($_SESSION["user_id"])) {
            $stmt = $conn->prepare("UPDATE checklists SET name = ?, description = ? WHERE id = ? AND user_id = ?");
            $stmt->bind_param("ssii", $input["name"], $input["description"], $input["id"], $_SESSION["user_id"]);
        } else {
            $stmt = $conn->prepare("UPDATE checklists SET name = ?, description = ? WHERE id = ? AND guest_id = ?");
            $stmt->bind_param("ssis", $input["name"], $input["description"], $input["id"], $_SESSION["guest_id"]);
        }

        $stmt->execute();
        echo json_encode(["message" => "チェックリスト更新成功"]);
        break;

    case 'DELETE': // チェックリスト削除
        $input = json_decode(file_get_contents("php://input"), true);
        if (!isset($input["id"])) {
            echo json_encode(["error" => "IDが指定されていません"]);
            exit;
        }

        if (isset($_SESSION["user_id"])) {
            $stmt = $conn->prepare("DELETE FROM checklists WHERE id = ? AND user_id = ?");
            $stmt->bind_param("ii", $input["id"], $_SESSION["user_id"]);
        } else {
            $stmt = $conn->prepare("DELETE FROM checklists WHERE id = ? AND guest_id = ?");
            $stmt->bind_param("is", $input["id"], $_SESSION["guest_id"]);
        }

        $stmt->execute();
        echo json_encode(["message" => "チェックリスト削除成功"]);
        break;
}

$conn->close();
