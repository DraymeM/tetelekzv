<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: https://danielmarkus.web.elte.hu");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

require_once __DIR__ . '/../../connect.php';
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

$qm     = new Question($kapcsolat);
$detail = $qm->findById($id);

if (! $detail) {
    http_response_code(404);
    exit(json_encode(['error' => 'Kérdés nem található.']));
}

echo json_encode($detail);
