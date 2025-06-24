<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: https://danielmarkus.web.elte.hu");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

$pdo = require __DIR__ . '/../../core/init.php';

if (!isset($_GET['id'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing group id']);
    exit;
}

$groupId = (int)$_GET['id'];

// Check group existence and public status
$stmt = $pdo->prepare("SELECT public FROM `group` WHERE id = :id");
$stmt->execute([':id' => $groupId]);
$group = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$group) {
    http_response_code(404);
    echo json_encode(['error' => 'Group not found']);
    exit;
}

$isPublic = (bool)$group['public'];

if (!$isPublic) {
    // Private group: require authentication and membership
    if (empty($_SESSION['authenticated']) || $_SESSION['authenticated'] !== true) {
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized']);
        exit;
    }
    // Check if the user is a member
    $stmt = $pdo->prepare("
        SELECT COUNT(*) 
        FROM groupuser 
        WHERE group_id = :group_id AND user_id = :user_id
    ");
    $stmt->execute([
        ':group_id' => $groupId,
        ':user_id' => $_SESSION['user_id']
    ]);
    $isMember = (bool)$stmt->fetchColumn();
    if (!$isMember) {
        http_response_code(403);
        echo json_encode(['error' => 'Forbidden']);
        exit;
    }
}

// Access granted: fetch and return group members
$stmt = $pdo->prepare("
    SELECT u.username, gu.can_create, gu.can_update, gu.can_delete, gu.joined_at
    FROM groupuser gu
    JOIN user u ON gu.user_id = u.id
    WHERE gu.group_id = :gid
");
$stmt->execute([':gid' => $groupId]);

$members = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($members);