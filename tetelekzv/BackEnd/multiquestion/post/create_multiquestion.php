<?php
require_once __DIR__ . '/../../core/bootstrap.php';
require_once __DIR__ . '/../../core/validate.php'; 

try {
    if ($_SERVER["REQUEST_METHOD"] === "POST") {
        $data = json_decode(file_get_contents("php://input"), true);
        validateString("question", $data["question"]); 
        validateArray("answers", $data["answers"]); 
        foreach ($data["answers"] as $answer) {
            validateString("answer text", $answer["text"]);
            if (!isset($answer["isCorrect"]) || !is_bool($answer["isCorrect"])) {
                throw new Exception("Érvénytelen válasz isCorrect mező");
            }
        }
        if (count($data["answers"]) < 2) {
            http_response_code(400);
            echo json_encode(["error" => "Legalább két válasz szükséges"]);
            exit;
        }

        $hasCorrect = array_reduce($data["answers"], fn($carry, $ans) => $carry || $ans["isCorrect"], false);
        if (!$hasCorrect) {
            http_response_code(400);
            echo json_encode(["error" => "Legalább egy válasznak helyesnek kell lennie"]);
            exit;
        }
        $kapcsolat->beginTransaction();
        $stmt = $kapcsolat->prepare("INSERT INTO questions (question) VALUES (?)");
        $stmt->execute([$data["question"]]);
        $questionId = $kapcsolat->lastInsertId();

        $stmt = $kapcsolat->prepare("INSERT INTO answers (question_id, answer_text, is_correct) VALUES (?, ?, ?)");
        foreach ($data["answers"] as $answer) {
            $stmt->execute([$questionId, $answer["text"], $answer["isCorrect"] ? 1 : 0]);
        }

        $kapcsolat->commit();
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
    if ($kapcsolat->inTransaction()) {
        $kapcsolat->rollBack();
    }
    http_response_code(500);
    echo json_encode(["error" => "Adatbázis hiba: " . $e->getMessage()]);
}
?>
