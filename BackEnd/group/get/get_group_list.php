<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: https://danielmarkus.web.elte.hu");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

$pdo = require __DIR__ . '/../../core/init.php';

require_once __DIR__ . '/../../models/Model.php';
require_once __DIR__ . '/../../models/Group.php';
require_once __DIR__ . '/../../models/GroupUser.php';

use Models\Group;

$page = isset($_GET['page']) ? max(1, (int)$_GET['page']) : 1;
$limit = isset($_GET['limit']) ? max(1, (int)$_GET['limit']) : 35;
$offset = ($page - 1) * $limit;

$model = new Group($pdo);
$userId = $_SESSION['user_id'] ?? 0;

$data = $model->findPaginatedWithMeta($userId, $limit, $offset);
$total = $model->countAll();

echo json_encode(['data' => $data, 'total' => $total]);
