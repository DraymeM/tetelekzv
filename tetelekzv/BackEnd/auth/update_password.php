<?php
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
$pdo = require __DIR__ . '/../core/init.php';
require_once __DIR__ . '/../models/Model.php';
require_once __DIR__ . '/../models/User.php';

use Models\User;
$data = json_decode(file_get_contents("php://input"), true);
if (
    ! isset(
        $data['current_password'],
        $data['password'],
        $data['password_confirmation']
    )
) {
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
    $userModel = new User($pdo);
    if (empty($_SESSION['user_id'])) {
        throw new InvalidArgumentException('Not authenticated');
    }

    $current = $userModel->findById($_SESSION['user_id']);
    if (! $current || ! $current->verifyPassword($data['current_password'])) {
        http_response_code(401);
        echo json_encode(["error" => "Current password is incorrect"]);
        exit;
    }
    $updated = $userModel->updatePassword(
        $_SESSION['user_id'],
        $data['password']
    );

    if ($updated) {
        echo json_encode([
            "success" => true,
            "message" => "Password updated successfully"
        ]);
    } else {
        throw new RuntimeException("No rows updated");
    }

} catch (InvalidArgumentException $e) {
    http_response_code(401);
    echo json_encode(["error" => $e->getMessage()]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Server error, please try again later"]);
}
