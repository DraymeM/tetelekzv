<?php
require_once __DIR__ . '/../../core/bootstrap.php';
require_once __DIR__ . '/../../models/Model.php';
require_once __DIR__ . '/../../models/Subsection.php';

use Models\Subsection;

$in = json_decode(file_get_contents('php://input'), true);
$id = $in['subsectionId'] ?? null;

if (! $id || !is_numeric($id)) {
    http_response_code(400);
    exit(json_encode(['error' => 'Érvénytelen al-szekció ID.']));
}

$sub = new Subsection($kapcsolat);
$sub->deleteById((int)$id);

echo json_encode(['success' => true]);
