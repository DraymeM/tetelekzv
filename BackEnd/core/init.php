<?php
session_start();
header("Access-Control-Allow-Origin: https://danielmarkus.web.elte.hu");
header("Access-Control-Allow-Headers: Content-Type");
require_once __DIR__ . '/rateLimiter.php';
$envFile = __DIR__ . '/../dev.env.php';
if (!file_exists($envFile)) {
    $envFile = __DIR__ . '/../env.php';
}
if (!file_exists($envFile)) {
    throw new RuntimeException('Missing env file for DB credentials');
}
$config = require $envFile;

$dsn = sprintf(
    'mysql:host=%s;dbname=%s;charset=utf8mb4',
    $config['DB_HOST'],
    $config['DB_NAME']
);

try {
    $pdo = new PDO($dsn, $config['DB_USER'], $config['DB_PASS'], [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
        PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES latin1"
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode([
        'error'   => true,
        'message' => 'Database connection failed'
    ]);
    exit;
}

// Global exception handler
set_exception_handler(function (\Throwable $e) {
    $code = $e instanceof InvalidArgumentException ? 400 : 500;
    http_response_code($code);
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode([
        'error'   => true,
        'message' => $e->getMessage()
    ]);
    exit;
});

// Set response header
header('Content-Type: application/json; charset=UTF-8');

// ✅ AUTH CHECK FOR PROTECTED POST REQUESTS
$filename = basename($_SERVER['SCRIPT_FILENAME']); // e.g. login.php, register.php
$publicFiles = ['login.php', 'register.php'];

if ($_SERVER['REQUEST_METHOD'] === 'POST' && !in_array($filename, $publicFiles)) {
    if (empty($_SESSION['authenticated']) || $_SESSION['authenticated'] !== true) {
        http_response_code(401);
        echo json_encode([
            'error'         => true,
            'authenticated' => false,
            'message'       => 'Authentication required'
        ]);
        exit;
    }
}

return $pdo;
