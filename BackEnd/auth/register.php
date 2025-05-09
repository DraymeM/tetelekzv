<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: https://danielmarkus.web.elte.hu");
header("Access-Control-Allow-Methods: POST");

require_once __DIR__ . '/../connect.php';
require_once __DIR__ . '/../models/Model.php';
require_once __DIR__ . '/../models/User.php';

use Models\User;

$data = json_decode(file_get_contents("php://input"), true);

$username = trim($data['username'] ?? '');
$password = $data['password'] ?? '';

if (! $username || ! $password) {
    http_response_code(400);
    echo json_encode(["error" => "Missing username or password"]);
    exit;
}

try {
    $userModel = new User($kapcsolat);

    if ($userModel->findByUsername($username)) {
        http_response_code(409);
        echo json_encode(["error" => "Username already taken"]);
        exit;
    }

    $userModel->create($username, $password);
    echo json_encode(["success" => true]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
