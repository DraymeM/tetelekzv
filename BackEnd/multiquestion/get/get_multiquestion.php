<?php
header("Access-Control-Allow-Methods: GET");
$pdo = require __DIR__ . '/../../core/init.php';
require_once __DIR__ . '/../../models/Model.php';
require_once __DIR__ . '/../../models/Answer.php';
require_once __DIR__ . '/../../models/Question.php';

use Models\Question;
$questionModel = new Question($pdo);
$item          = $questionModel->findRandom();
if (! $item) {
    http_response_code(404);
    exit(json_encode(['error' => 'No questions found']));
}
echo json_encode($item);
