<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: https://danielmarkus.web.elte.hu");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

$pdo = require __DIR__ . '/../../core/init.php';

require_once __DIR__ . '/../../models/Model.php';
require_once __DIR__ . '/../../models/Tetel.php';

use Models\Tetel;

$page = isset($_GET['page']) ? max(1, (int)$_GET['page']) : 1;
$limit = isset($_GET['limit']) ? max(1, (int)$_GET['limit']) : 35;
$offset = ($page - 1) * $limit;

$t = new Tetel($pdo);
$data = $t->findPaginated($limit, $offset);
$total = $t->countAll();

echo json_encode([
    'data' => $data,
    'total' => $total
]);
