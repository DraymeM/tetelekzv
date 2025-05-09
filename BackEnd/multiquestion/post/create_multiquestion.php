<?php
require_once __DIR__ . '/../../core/bootstrap.php';
require_once __DIR__ . '/../../models/Model.php';
require_once __DIR__ . '/../../models/Answer.php';
require_once __DIR__ . '/../../models/Question.php';

use Models\Question;

$data = json_decode(file_get_contents('php://input'), true);

if (
    empty($data['question']) ||
    ! is_string($data['question']) ||
    empty($data['answers']) ||
    ! is_array($data['answers'])
) {
    http_response_code(400);
    exit(json_encode(['error' => 'Érvénytelen kérdés vagy válaszok']));
}

try {
    // Ensure at least one correct answer
    $hasCorrect = array_reduce(
        $data['answers'],
        fn($c, $a) => $c || (!empty($a['isCorrect'])),
        false
    );
    if (! $hasCorrect) {
        throw new \Exception("Legalább egy válasznak helyesnek kell lennie");
    }

    $qm    = new Question($kapcsolat);
    $newId = $qm->createWithAnswers($data['question'], $data['answers']);
    $out   = $qm->findById($newId);

    echo json_encode($out);
} catch (\Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
