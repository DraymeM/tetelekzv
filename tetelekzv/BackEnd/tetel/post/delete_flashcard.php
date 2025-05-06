<?php
require_once __DIR__ . '/../../core/bootstrap.php';
ini_set('display_errors', 1);
error_reporting(E_ALL);

try {
    $input = json_decode(file_get_contents("php://input"), true);
    $flashcardId = $input["flashcardId"];

    if (!$flashcardId || !is_numeric($flashcardId)) {
        http_response_code(400);
        echo json_encode(["error" => "Érvénytelen flashcard ID."]);
        exit;
    }

    // Delete the flashcard
    $stmt = $kapcsolat->prepare("DELETE FROM flashcard WHERE id = ?");
    $stmt->execute([$flashcardId]);

    echo json_encode(["success" => true]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Szerver hiba: " . $e->getMessage()]);
}
