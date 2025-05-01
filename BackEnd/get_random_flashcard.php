<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: https://danielmarkus.web.elte.hu");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

require_once __DIR__ . '/connect.php';

try {
    $stmt = $kapcsolat->query("SELECT id, question, answer FROM flashcard ORDER BY RAND() LIMIT 1");
    $flashcard = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($flashcard) {
        $result = [
            "id" => (int)$flashcard["id"],
            "question" => $flashcard["question"],
            "answer" => $flashcard["answer"]
        ];
        echo json_encode($result);
    } else {
        echo json_encode(["error" => "No flashcards found"]);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Hiba a lekérdezés során: " . $e->getMessage()]);
}
?>