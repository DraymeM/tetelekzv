<?php
header("Access-Control-Allow-Methods: GET");
$pdo = require __DIR__ . '/../../core/init.php';

require_once __DIR__ . '/../../models/Model.php';
require_once __DIR__ . '/../../models/Answer.php';
require_once __DIR__ . '/../../models/Question.php';

use Models\Question;
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    exit(json_encode(['error' => 'Csak GET kérés engedélyezett.']));
}

$id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);
if (! $id) {
    http_response_code(400);
    exit(json_encode(['error' => 'Érvénytelen kérdés ID.']));
}
$questionModel = new Question($pdo);
$detail        = $questionModel->findById($id);
if (! $detail) {
    http_response_code(404);
    exit(json_encode(['error' => 'Kérdés nem található.']));
}
echo json_encode($detail);
