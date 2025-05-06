<?php
require_once __DIR__ . '/../../core/bootstrap.php';

try {
    if ($_SERVER["REQUEST_METHOD"] === "POST") {
        $data = json_decode(file_get_contents("php://input"), true);

        // Validate input
        if (
            !isset($data["question"]) ||
            !is_string($data["question"]) ||
            !isset($data["answers"]) ||
            !is_array($data["answers"]) ||
            count($data["answers"]) < 2 ||
            !array_reduce($data["answers"], fn($carry, $ans) => $carry && isset($ans["text"]) && isset($ans["isCorrect"]) && is_string($ans["text"]) && is_bool($ans["isCorrect"]), true)
        ) {
            http_response_code(400);
            echo json_encode(["error" => "Érvénytelen kérdés vagy válaszok"]);
            exit;
        }

        // Check for at least one correct answer
        $hasCorrect = array_reduce($data["answers"], fn($carry, $ans) => $carry || $ans["isCorrect"], false);
        if (!$hasCorrect) {
            http_response_code(400);
            echo json_encode(["error" => "Legalább egy válasznak helyesnek kell lennie"]);
            exit;
        }

        // Start transaction
        $kapcsolat->beginTransaction();

        // Insert question into questions
        $stmt = $kapcsolat->prepare("INSERT INTO questions (question) VALUES (?)");
        $stmt->execute([$data["question"]]);
        $questionId = $kapcsolat->lastInsertId();

        // Insert answers into answers
        $stmt = $kapcsolat->prepare("INSERT INTO answers (question_id, answer_text, is_correct) VALUES (?, ?, ?)");
        foreach ($data["answers"] as $answer) {
            $stmt->execute([$questionId, $answer["text"], $answer["isCorrect"] ? 1 : 0]);
        }

        // Commit transaction
        $kapcsolat->commit();

        // Prepare response
        $newQuestion = [
            "id" => (int)$questionId,
            "question" => $data["question"],
            "answers" => $data["answers"],
        ];

        http_response_code(200);
        echo json_encode($newQuestion);
        exit;
    }

    http_response_code(400);
    echo json_encode(["error" => "Érvénytelen kérés"]);
} catch (Exception $e) {
    // Rollback on error
    if ($kapcsolat->inTransaction()) {
        $kapcsolat->rollBack();
    }
    http_response_code(500);
    echo json_encode(["error" => "Adatbázis hiba: " . $e->getMessage()]);
}
?>