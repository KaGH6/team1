<?php
require 'db.php';
session_start();

// 🔹 CORS 設定
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// 🔹 OPTIONSリクエストの処理（プリフライトリクエスト対応）
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// 🔹 ユーザー情報の取得
$userId = $_SESSION["id"] ?? null;
$guestId = $_SESSION["guest_id"] ?? null;

// 🔹 フロントエンドから送られたデータの取得
$input = json_decode(file_get_contents("php://input"), true);

// 🔹 `guest_id` の取得がない場合、新しいゲストIDを生成
if (!$userId && !$guestId) {
    $guestId = "guest-" . bin2hex(random_bytes(6)); // ランダムなゲストID
    $_SESSION["guest_id"] = $guestId;
}

// 🔹 デバッグログ
error_log("userId: " . ($userId ?? "NULL") . " | guestId: " . ($guestId ?? "NULL"));

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET': // 🔹 カテゴリ取得
        $userId = $_GET["user_id"] ?? null;
        $guestId = $_GET["guest_id"] ?? null;

        error_log("🔍 GETリクエスト - userId: " . ($userId ?? 'NULL') . " | guestId: " . ($guestId ?? 'NULL'));
        if ($userId) {
            error_log("✅ ログインユーザーのカテゴリを取得します。");
            $stmt = $conn->prepare("SELECT * FROM categories WHERE user_id = ?");
            $stmt->bind_param("i", $userId);
        } elseif ($guestId) {
            error_log("👤 ゲストユーザーのカテゴリを取得します。");
            $stmt = $conn->prepare("SELECT * FROM categories WHERE guest_id = ?");
            $stmt->bind_param("s", $guestId);
        } else {
            error_log("⚠ ユーザーIDもゲストIDも取得できませんでした。");
            echo json_encode(["error" => "認証情報がありません"]);
            exit();
        }

        $stmt->execute();
        $result = $stmt->get_result();
        $data = [];
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        echo json_encode($data);
        break;

    case 'POST': // 🔹 カテゴリ作成
        if (!isset($input["name"])) {
            echo json_encode(["error" => "カテゴリ名が必要です"]);
            exit();
        }

        if ($userId) {
            $stmt = $conn->prepare("INSERT INTO categories (name, user_id) VALUES (?, ?)");
            $stmt->bind_param("si", $input["name"], $userId);
        } elseif ($guestId) {
            $stmt = $conn->prepare("INSERT INTO categories (name, guest_id) VALUES (?, ?)");
            $stmt->bind_param("ss", $input["name"], $guestId);
        } else {
            echo json_encode(["error" => "認証情報がありません"]);
            exit();
        }

        $stmt->execute();
        echo json_encode(["message" => "カテゴリ作成成功"]);
        break;

    case 'PUT': // 🔹 カテゴリ更新
        if (!isset($input["id"], $input["name"])) {
            echo json_encode(["error" => "必要なデータが不足しています"]);
            exit();
        }

        if ($userId) {
            $stmt = $conn->prepare("UPDATE categories SET name = ? WHERE id = ? AND user_id = ?");
            $stmt->bind_param("sii", $input["name"], $input["id"], $userId);
        } elseif ($guestId) {
            $stmt = $conn->prepare("UPDATE categories SET name = ? WHERE id = ? AND guest_id = ?");
            $stmt->bind_param("sis", $input["name"], $input["id"], $guestId);
        } else {
            echo json_encode(["error" => "認証情報がありません"]);
            exit();
        }

        $stmt->execute();
        echo json_encode(["message" => "カテゴリ更新成功"]);
        break;

    case 'DELETE': // 🔹 カテゴリ削除
        if (!isset($input["id"])) {
            echo json_encode(["error" => "IDが指定されていません"]);
            exit();
        }

        if ($userId) {
            $stmt = $conn->prepare("DELETE FROM categories WHERE id = ? AND user_id = ?");
            $stmt->bind_param("ii", $input["id"], $userId);
        } elseif ($guestId) {
            $stmt = $conn->prepare("DELETE FROM categories WHERE id = ? AND guest_id = ?");
            $stmt->bind_param("is", $input["id"], $guestId);
        } else {
            echo json_encode(["error" => "認証情報がありません"]);
            exit();
        }

        $stmt->execute();
        echo json_encode(["message" => "カテゴリ削除成功"]);
        break;
}

$conn->close();
