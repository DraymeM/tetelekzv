<?php
session_start();
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: https://danielmarkus.web.elte.hu");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
require_once __DIR__ . '/../connect.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['username'], $data['password'])) {
    http_response_code(400);
    echo json_encode(["error" => "Missing username or password"]);
    exit;
}

$username = $data['username'];
$password = $data['password'];

try {
    $stmt = $kapcsolat->prepare("SELECT id, password, superuser FROM user WHERE username = ?");
    $stmt->execute([$username]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user || !password_verify($password, $user['password'])) {
        http_response_code(401);
        echo json_encode(["error" => "Invalid credentials"]);
        exit;
    }

    // Store user data in session
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['superuser'] = $user['superuser'];
    $_SESSION['authenticated'] = true;

    // Set session cookie parameters
    $sessionParams = session_get_cookie_params();
    setcookie(
        session_name(),
        session_id(),
        [
            'expires' => time() + 86400, // 1 day
            'path' => $sessionParams['path'],
            'domain' => $sessionParams['domain'],
            'secure' => true,
            'httponly' => true,
            'samesite' => 'Lax'
        ]
    );

    echo json_encode(["success" => true]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}