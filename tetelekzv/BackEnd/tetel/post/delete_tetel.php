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
$id   = $data['id'] ?? null;

if (! $id || !is_numeric($id)) {
    http_response_code(400);
    exit(json_encode(['error' => 'Érvénytelen tétel ID.']));
}

$t = new Tetel($kapcsolat);
$t->deleteById((int)$id);

echo json_encode(['success' => true]);
