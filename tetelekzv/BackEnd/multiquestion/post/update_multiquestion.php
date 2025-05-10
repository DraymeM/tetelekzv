<?php
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");

$pdo = require __DIR__ . '/../../core/init.php';

require_once __DIR__ . '/../../models/Model.php';
require_once __DIR__ . '/../../models/Answer.php';
require_once __DIR__ . '/../../models/Question.php';

use Models\Question;
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit;
}

$id   = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);
$data = json_decode(file_get_contents('php://input'), true);

if (
    ! $id ||
    empty($data['question']) ||
    ! is_array($data['answers'])
) {
    http_response_code(400);
    exit;
}

try {
    $hasCorrect = array_reduce(
        $data['answers'],
        fn($c, $a) => $c || (!empty($a['isCorrect'])),
        false
    );
    if (! $hasCorrect) {
        throw new Exception("Legalább egy válasznak helyesnek kell lennie");
    }

    $qm = new Question($pdo);
    $qm->updateWithAnswers($id, $data['question'], $data['answers']);

    echo json_encode(['success' => true]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
