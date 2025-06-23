<?php
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");

$pdo = require __DIR__ . '/../../core/init.php';

require_once __DIR__ . '/../../models/Model.php';
require_once __DIR__ . '/../../models/Group.php';
require_once __DIR__ . '/../../models/GroupUser.php';
require_once __DIR__ . '/../../models/User.php';

use Models\Group;
use Models\GroupUser;

$data = json_decode(file_get_contents('php://input'), true);

if (empty($data['name']) || !isset($data['public'])) {
    http_response_code(400);
    exit(json_encode(['error' => 'Hiányzó vagy érvénytelen mezők.']));
}

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    exit(json_encode(['error' => 'Nincs bejelentkezve.']));
}

try {
    $userId = (int) $_SESSION['user_id'];

    // 3. Create the group
    $group = new Group($pdo);
    $groupId = $group->create($data['name'], (bool)$data['public']);

    // 4. Add the creator as an admin of the group
    $groupUser = new GroupUser($pdo);
    $groupUser->addUserToGroup($userId, $groupId, [
        'create' => true,
        'update' => true,
        'delete' => true,
    ]);

    echo json_encode(['success' => true, 'group_id' => $groupId]);
} catch (\Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
