<?php
session_start();
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: https://danielmarkus.web.elte.hu");
header("Access-Control-Allow-Credentials: true");

if (isset($_SESSION['authenticated']) && $_SESSION['authenticated'] === true) {
    echo json_encode([
        "authenticated" => true,
        "userId" => $_SESSION['user_id'],
        "username" => $_SESSION['username'],
        "superuser" => $_SESSION['superuser']
    ]);
} else {
    echo json_encode(["authenticated" => false]);
}
exit;