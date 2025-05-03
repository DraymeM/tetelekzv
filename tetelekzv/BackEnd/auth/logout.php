<?php
session_start();
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: https://danielmarkus.web.elte.hu");
header("Access-Control-Allow-Credentials: true");

// Destroy session
$_SESSION = array();
session_destroy();

// Expire session cookie
$sessionParams = session_get_cookie_params();
setcookie(
    session_name(),
    '',
    [
        'expires' => time() - 3600,
        'path' => $sessionParams['path'],
        'domain' => $sessionParams['domain'],
        'secure' => true,
        'httponly' => true,
        'samesite' => 'Lax'
    ]
);

echo json_encode(["success" => true]);
exit;