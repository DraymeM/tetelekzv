<?php
require_once __DIR__ . '/../../core/bootstrap.php';
require_once __DIR__ . '/../../models/Model.php';
require_once __DIR__ . '/../../models/Subsection.php';
require_once __DIR__ . '/../../models/Section.php';

use Models\Subsection;
use Models\Section;

$in  = json_decode(file_get_contents('php://input'), true);
$id  = $in['sectionId'] ?? null;

if (! $id || !is_numeric($id)) {
    http_response_code(400);
    exit(json_encode(['error' => 'Érvénytelen szekció ID.']));
}

$sub = new Subsection($kapcsolat);
$sub->deleteBySectionId((int)$id);

$sec = new Section($kapcsolat);
$sec->deleteById((int)$id);

echo json_encode(['success' => true]);
