<?php
header("Access-Control-Allow-Methods: POST");
$pdo = require __DIR__ . '/../core/init.php';
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
    $userModel = new User($pdo);

    if ($userModel->findByUsername($username)) {
        http_response_code(409);
        echo json_encode(["error" => "Username already taken"]);
        exit;
    }

    $userModel->create($username, $password);
    echo json_encode(["success" => true]);

} catch (InvalidArgumentException $e) {

    http_response_code(400);
    echo json_encode(["error" => $e->getMessage()]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Server error, please try again later"]);
}
