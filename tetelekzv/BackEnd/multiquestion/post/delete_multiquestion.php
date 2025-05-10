<?php
header("Access-Control-Allow-Methods: DELETE");
header("Access-Control-Allow-Credentials: true");

$pdo = require __DIR__ . '/../../core/init.php';

require_once __DIR__ . '/../../models/Model.php';
require_once __DIR__ . '/../../models/Answer.php';
require_once __DIR__ . '/../../models/Question.php';

use Models\Question;

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    http_response_code(405);
    exit(json_encode(['error' => 'Csak DELETE kérés engedélyezett.']));
}

if (empty($_SESSION['superuser']) || $_SESSION['superuser'] !== true) {
    http_response_code(403);
    exit(json_encode(['error' => 'Nincs jogosultság a törléshez.']));
}

$payload = json_decode(file_get_contents('php://input'), true);
$id      = filter_var($payload['id'] ?? null, FILTER_VALIDATE_INT);

if (! $id) {
    http_response_code(400);
    exit(json_encode(['error' => 'Érvénytelen kérdés ID.']));
}

try {
    $qm = new Question($pdo);
    $qm->deleteById($id);
    echo json_encode(['success' => true]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
