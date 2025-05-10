<?php
header("Access-Control-Allow-Credentials: true");
$pdo = require __DIR__ . '/../core/init.php';
$_SESSION = [];
session_destroy();
$params = session_get_cookie_params();
setcookie(
    session_name(),
    '',
    [
        'expires'  => time() - 3600,
        'path'     => $params['path'],
        'domain'   => $params['domain'],
        'secure'   => true,
        'httponly' => true,
        'samesite' => 'Lax'
    ]
);
echo json_encode(["success" => true]);
exit;
