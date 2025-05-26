<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");

$pdo = require __DIR__ . '/../../core/init.php';

require_once __DIR__ . '/../../models/Model.php';
require_once __DIR__ . '/../../models/Flashcard.php';

use Models\Flashcard;

$fc = new Flashcard($pdo);
$total = $fc->countAll(); 

if ($total === false) {
    http_response_code(500);
    exit(json_encode(['error' => 'Failed to count flashcards']));
}

echo json_encode(['total' => $total]);
