<?php
header("Access-Control-Allow-Credentials: true");
$pdo = require __DIR__ . '/../core/init.php';

if (! empty($_SESSION['authenticated']) && $_SESSION['authenticated'] === true) {
    echo json_encode([
        "authenticated" => true,
        "userId"        => $_SESSION['user_id'],
        "username"      => $_SESSION['username'],
        "superuser"     => $_SESSION['superuser']
    ]);
} else {
    echo json_encode(["authenticated" => false]);
}

exit;
