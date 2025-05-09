<?php
require_once __DIR__ . '/../../core/bootstrap.php';
require_once __DIR__ . '/../../models/Model.php';
require_once __DIR__ . '/../../models/Osszegzes.php';
require_once __DIR__ . '/../../models/Flashcard.php';
require_once __DIR__ . '/../../models/Section.php';
require_once __DIR__ . '/../../models/Subsection.php';
require_once __DIR__ . '/../../models/Tetel.php';

use Models\Tetel;

$data = json_decode(file_get_contents('php://input'), true);
if (
    empty($data['name']) ||
    !isset($data['osszegzes'], $data['sections'], $data['flashcards']) ||
    !is_string($data['osszegzes']) ||
    !is_array($data['sections']) ||
    !is_array($data['flashcards'])
) {
    http_response_code(400);
    exit(json_encode(['error' => 'Hiányzó vagy érvénytelen mezők.']));
}

try {
    $t    = new Tetel($kapcsolat);
    $id   = $t->createFull($data);
    echo json_encode(['success' => true, 'tetel_id' => $id]);
} catch (\Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
