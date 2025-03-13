<?php
require 'db.php';
session_start();

if (!isset($_SESSION["guest_id"]) && !isset($_SESSION["user_id"])) {
    $_SESSION["guest_id"] = session_id();
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET': // カテゴリ取得
        if (isset($_SESSION["user_id"])) {
            $stmt = $conn->prepare("SELECT * FROM categories WHERE user_id = ?");
            $stmt->bind_param("i", $_SESSION["user_id"]);
        } else {
            $stmt = $conn->prepare("SELECT * FROM categories WHERE guest_id = ?");
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

    case 'POST': // カテゴリ作成
        $input = json_decode(file_get_contents("php://input"), true);
        if (!isset($input["name"])) {
            echo json_encode(["error" => "カテゴリ名が必要です"]);
            exit;
        }

        if (isset($_SESSION["user_id"])) {
            $stmt = $conn->prepare("INSERT INTO categories (name, user_id) VALUES (?, ?)");
            $stmt->bind_param("si", $input["name"], $_SESSION["user_id"]);
        } else {
            $stmt = $conn->prepare("INSERT INTO categories (name, guest_id) VALUES (?, ?)");
            $stmt->bind_param("ss", $input["name"], $_SESSION["guest_id"]);
        }

        $stmt->execute();
        echo json_encode(["message" => "カテゴリ作成成功"]);
        break;

    case 'PUT': // カテゴリ更新
        $input = json_decode(file_get_contents("php://input"), true);
        if (!isset($input["id"], $input["name"])) {
            echo json_encode(["error" => "必要なデータが不足しています"]);
            exit;
        }

        if (isset($_SESSION["user_id"])) {
            $stmt = $conn->prepare("UPDATE categories SET name = ? WHERE id = ? AND user_id = ?");
            $stmt->bind_param("sii", $input["name"], $input["id"], $_SESSION["user_id"]);
        } else {
            $stmt = $conn->prepare("UPDATE categories SET name = ? WHERE id = ? AND guest_id = ?");
            $stmt->bind_param("sis", $input["name"], $input["id"], $_SESSION["guest_id"]);
        }

        $stmt->execute();
        echo json_encode(["message" => "カテゴリ更新成功"]);
        break;

    case 'DELETE': // カテゴリ削除
        $input = json_decode(file_get_contents("php://input"), true);
        if (!isset($input["id"])) {
            echo json_encode(["error" => "IDが指定されていません"]);
            exit;
        }

        if (isset($_SESSION["user_id"])) {
            $stmt = $conn->prepare("DELETE FROM categories WHERE id = ? AND user_id = ?");
            $stmt->bind_param("ii", $input["id"], $_SESSION["user_id"]);
        } else {
            $stmt = $conn->prepare("DELETE FROM categories WHERE id = ? AND guest_id = ?");
            $stmt->bind_param("is", $input["id"], $_SESSION["guest_id"]);
        }

        $stmt->execute();
        echo json_encode(["message" => "カテゴリ削除成功"]);
        break;
}

$conn->close();
