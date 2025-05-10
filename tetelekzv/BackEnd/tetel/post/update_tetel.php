<?php
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");

$pdo = require __DIR__ . '/../../core/init.php';
require_once __DIR__ . '/../../models/Model.php';
require_once __DIR__ . '/../../models/Osszegzes.php';
require_once __DIR__ . '/../../models/Flashcard.php';
require_once __DIR__ . '/../../models/Section.php';
require_once __DIR__ . '/../../models/Subsection.php';
require_once __DIR__ . '/../../models/Tetel.php';

use Models\Tetel;

$id   = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);
$data = json_decode(file_get_contents('php://input'), true);

if (
    ! $id ||
    empty($data['name']) ||
    !isset($data['osszegzes'], $data['sections'], $data['flashcards'])
) {
    http_response_code(400);
    exit(json_encode(['error' => 'Invalid data or missing required fields.']));
}

try {
    $t = new Tetel($pdo);
    $t->updateFull($id, $data);
    echo json_encode(['success' => true]);
} catch (\Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
