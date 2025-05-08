<?php
require_once __DIR__ . '/../../core/bootstrap.php';
ini_set('display_errors', 1);
error_reporting(E_ALL);

// 1) Permission check (must be authenticated + superuser)
if (
    !isset($_SESSION['authenticated']) || $_SESSION['authenticated'] !== true ||
    !isset($_SESSION['superuser'])    || $_SESSION['superuser']    != 1
) {
    http_response_code(403);
    echo json_encode(["error" => "Nincs jogosultság a művelethez."]);
    exit;
}

// 2) Only allow DELETE
if ($_SERVER["REQUEST_METHOD"] !== "DELETE") {
    http_response_code(405);
    echo json_encode(["error" => "Csak DELETE kérés engedélyezett."]);
    exit;
}

// 3) Parse JSON body for ID
$payload = json_decode(file_get_contents("php://input"), true);
if (!isset($payload['id']) || !is_numeric($payload['id'])) {
    http_response_code(400);
    echo json_encode(["error" => "Érvénytelen kérdés ID."]);
    exit;
}
$questionId = (int)$payload['id'];

try {
    // 4) Start transaction
    $kapcsolat->beginTransaction();

    // 5) Delete answers tied to this question
    $stmt = $kapcsolat->prepare("
        DELETE FROM answers
        WHERE question_id = ?
    ");
    $stmt->execute([$questionId]);

    // 6) Delete the question itself
    $stmt = $kapcsolat->prepare("
        DELETE FROM questions
        WHERE id = ?
    ");
    $stmt->execute([$questionId]);

    // 7) Commit
    $kapcsolat->commit();
    echo json_encode(["success" => true]);

} catch (Exception $e) {
    // Roll back on error
    if ($kapcsolat->inTransaction()) {
        $kapcsolat->rollBack();
    }
    http_response_code(500);
    echo json_encode(["error" => "Adatbázis hiba: " . $e->getMessage()]);
}
