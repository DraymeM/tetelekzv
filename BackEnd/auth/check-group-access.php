<?php
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");

$pdo = require __DIR__ . '/../core/init.php';

if (empty($_SESSION['authenticated']) || $_SESSION['authenticated'] !== true) {
    echo json_encode([
        'authenticated' => false,
        'isMember' => false,
        'isPublic' => false,
        'canCreate' => false,
        'canUpdate' => false,
        'canDelete' => false
    ]);
    exit;
}

$groupId = isset($_GET['group_id']) ? (int)$_GET['group_id'] : 0;

if ($groupId === 0) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid group ID']);
    exit;
}

try {
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
    $isMember = false;
    $permissions = [
        'canCreate' => false,
        'canUpdate' => false,
        'canDelete' => false
    ];

    // Check membership and permissions
    $stmt = $pdo->prepare("
        SELECT can_create, can_update, can_delete 
        FROM groupuser 
        WHERE group_id = :group_id AND user_id = :user_id
    ");
    $stmt->execute([
        ':group_id' => $groupId,
        ':user_id' => $_SESSION['user_id']
    ]);
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($result) {
        $isMember = true;
        $permissions = [
            'canCreate' => (bool)$result['can_create'],
            'canUpdate' => (bool)$result['can_update'],
            'canDelete' => (bool)$result['can_delete']
        ];
    }

    echo json_encode([
        'authenticated' => true,
        'isPublic' => $isPublic,
        'isMember' => $isMember,
        'userId' => $_SESSION['user_id'],
        ...$permissions
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error']);
}

exit;