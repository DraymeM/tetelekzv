<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: https://danielmarkus.web.elte.hu");
header("Access-Control-Allow-Methods: POST");
require_once __DIR__ . '/../connect.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['userId'], $data['newPassword'])) {
    http_response_code(400);
    echo json_encode(["error" => "Missing userId or newPassword"]);
    exit;
}

$userId = (int)$data['userId'];
$newPassword = $data['newPassword'];

try {
    $stmt = $kapcsolat->prepare("SELECT superuser FROM user WHERE id = ?");
    $stmt->execute([$userId]);
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$result || !$result["superuser"]) {
        http_response_code(403);
        echo json_encode(["error" => "Not authorized"]);
        exit;
    }

    // Password reset logic
    $targetUserId = (int)$data['targetUserId'];
    $hashed = password_hash($newPassword, PASSWORD_DEFAULT);
    $stmt = $kapcsolat->prepare("UPDATE user SET password = ? WHERE id = ?");
    $stmt->execute([$hashed, $targetUserId]);

    echo json_encode(["success" => true]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
