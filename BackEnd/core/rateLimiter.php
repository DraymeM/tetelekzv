<?php

$rateLimitWindow = 600; 
$rateLimitMax = 100;

if (!isset($_SESSION['rate_limit'])) {
    $_SESSION['rate_limit'] = [
        'start_time' => time(),
        'count' => 0
    ];
}
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $rateLimitMax = 1000;
}
$now = time();
if ($now - $_SESSION['rate_limit']['start_time'] > $rateLimitWindow) {
    $_SESSION['rate_limit']['start_time'] = $now;
    $_SESSION['rate_limit']['count'] = 1;
} else {
    $_SESSION['rate_limit']['count']++;
    if ($_SESSION['rate_limit']['count'] > $rateLimitMax) {
        http_response_code(429);
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode([
            'error' => true,
            'message' => 'Rate limit exceeded. Try again later.'
        ]);
        exit;
    }
}
