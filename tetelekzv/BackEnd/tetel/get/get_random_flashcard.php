<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: https://danielmarkus.web.elte.hu");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

require_once __DIR__ . '/../../connect.php';
require_once __DIR__ . '/../../models/Model.php';
require_once __DIR__ . '/../../models/Flashcard.php';

use Models\Flashcard;

$fc = new Flashcard($kapcsolat);
$card = $fc->findRandom();

if (! $card) {
    http_response_code(404);
    exit(json_encode(['error' => 'No flashcards found']));
}
echo json_encode($card);
