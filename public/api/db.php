<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");

$host = "localhost";
$user = "root";
$pass = "";
$dbname = "wasuren";
$port = 3306;

$conn = new mysqli($host, $user, $pass, $dbname, $port);
if ($conn->connect_error) {
    die(json_encode(["error" => "データベース接続失敗: " . $conn->connect_error]));
}
