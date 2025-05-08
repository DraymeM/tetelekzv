<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: https://danielmarkus.web.elte.hu");
header("Access-Control-Allow-Methods: POST");
require_once __DIR__ . '/../connect.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['username'], $data['password'])) {
    http_response_code(400);
    echo json_encode(["error" => "Missing username or password"]);
    exit;
}

$username = trim($data['username']);
$password = $data['password'];

try {
    $stmt = $kapcsolat->prepare("SELECT id FROM user WHERE username = ?");
    $stmt->execute([$username]);
    if ($stmt->fetch()) {
        http_response_code(409);
        echo json_encode(["error" => "Username already taken"]);
        exit;
    }

    $hash = password_hash($password, PASSWORD_DEFAULT);

    $stmt = $kapcsolat->prepare("INSERT INTO user (username, password) VALUES (?, ?)");
    $stmt->execute([$username, $hash]);

    echo json_encode(["success" => true]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
