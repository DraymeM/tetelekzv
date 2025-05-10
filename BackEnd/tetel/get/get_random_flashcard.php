<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");

$pdo = require __DIR__ . '/../../core/init.php';

require_once __DIR__ . '/../../models/Model.php';
require_once __DIR__ . '/../../models/Flashcard.php';

use Models\Flashcard;

$fc   = new Flashcard($pdo);
$card = $fc->findRandom();

if (! $card) {
    http_response_code(404);
    exit(json_encode(['error' => 'No flashcards found']));
}

echo json_encode($card);
