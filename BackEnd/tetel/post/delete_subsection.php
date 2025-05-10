<?php
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
$pdo = require __DIR__ . '/../../core/init.php';
require_once __DIR__ . '/../../models/Model.php';
require_once __DIR__ . '/../../models/Subsection.php';

use Models\Subsection;

$in = json_decode(file_get_contents('php://input'), true);
$id = $in['subsectionId'] ?? null;

if (!$id || !is_numeric($id)) {
    http_response_code(400);
    exit(json_encode(['error' => 'Érvénytelen al-szekció ID.']));
}

try {
    // Perform the deletion
    $sub = new Subsection($pdo);
    $sub->deleteById((int)$id);

    echo json_encode(['success' => true]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
