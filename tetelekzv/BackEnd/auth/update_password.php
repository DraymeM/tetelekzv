<?php
require_once __DIR__ . '/../core/bootstrap.php';

// Validate input
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['current_password'], $data['password'], $data['password_confirmation'])) {
    http_response_code(400);
    echo json_encode(["error" => "Missing required fields"]);
    exit;
}

if ($data['password'] !== $data['password_confirmation']) {
    http_response_code(422);
    echo json_encode(["error" => "Password confirmation does not match"]);
    exit;
}

try {
    // Verify current password
    $stmt = $kapcsolat->prepare("SELECT password FROM user WHERE id = ?");
    $stmt->execute([$_SESSION['user_id']]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user || !password_verify($data['current_password'], $user['password'])) {
        http_response_code(401);
        echo json_encode(["error" => "Current password is incorrect"]);
        exit;
    }

    // Update password
    $newPasswordHash = password_hash($data['password'], PASSWORD_DEFAULT);
    $updateStmt = $kapcsolat->prepare("UPDATE user SET password = ? WHERE id = ?");
    $updateStmt->execute([$newPasswordHash, $_SESSION['user_id']]);

    echo json_encode(["success" => true, "message" => "Password updated successfully"]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
