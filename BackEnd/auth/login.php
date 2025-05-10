<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: https://danielmarkus.web.elte.hu");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");

$pdo = require __DIR__ . '/../core/init.php';

require_once __DIR__ . '/../models/Model.php';
require_once __DIR__ . '/../models/User.php';

use Models\User;

$data = json_decode(file_get_contents("php://input"), true);
if (empty($data['username']) || empty($data['password'])) {
    http_response_code(400);
    echo json_encode(["error" => "Missing username or password"]);
    exit;
}

$username = $data['username'];
$password = $data['password'];

try {
    $userModel = new User($pdo);
    $user      = $userModel->findByUsername($username);

    if (! $user || ! $user->verifyPassword($password)) {
        http_response_code(401);
        echo json_encode(["error" => "Invalid credentials"]);
        exit;
    }
    $_SESSION['user_id']       = $user->getId();
    $_SESSION['username']      = $user->getUsername();
    $_SESSION['superuser']     = $user->isSuperuser();
    $_SESSION['authenticated'] = true;

    $params = session_get_cookie_params();
    setcookie(
        session_name(),
        session_id(),
        [
            'expires'  => time() + 86400,
            'path'     => $params['path'],
            'domain'   => $params['domain'],
            'secure'   => false,
            'httponly' => true,
            'samesite' => 'Lax'
        ]
    );

    echo json_encode(["success" => true]);
} catch (InvalidArgumentException $e) {
    http_response_code(400);
    echo json_encode(["error" => $e->getMessage()]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Server error, please try again later"]);
}
