<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: https://danielmarkus.web.elte.hu");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

require_once __DIR__ . '/../../connect.php';
require_once __DIR__ . '/../../models/Model.php';
require_once __DIR__ . '/../../models/Osszegzes.php';
require_once __DIR__ . '/../../models/Flashcard.php';
require_once __DIR__ . '/../../models/Section.php';
require_once __DIR__ . '/../../models/Subsection.php';
require_once __DIR__ . '/../../models/Tetel.php';

use Models\Tetel;

$id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);
if (! $id) {
    http_response_code(400);
    exit(json_encode(['error' => 'Érvénytelen tétel ID.']));
}

$t = new Tetel($kapcsolat);
$detail = $t->findById($id);

if (! $detail) {
    http_response_code(404);
    exit(json_encode(['error' => 'Tétel nem található.']));
}

echo json_encode($detail);
