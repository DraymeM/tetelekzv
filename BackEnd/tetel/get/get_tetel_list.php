<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: https://danielmarkus.web.elte.hu");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

$pdo = require __DIR__ . '/../../core/init.php';

require_once __DIR__ . '/../../models/Model.php';
require_once __DIR__ . '/../../models/Tetel.php';

use Models\Tetel;

$t = new Tetel($pdo);
$list = $t->findAll();

echo json_encode($list);
