<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: https://danielmarkus.web.elte.hu");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

require_once __DIR__ . '/../../connect.php';

try {
    // Fetch a single random question
    $stmt = $kapcsolat->query("SELECT id, question FROM questions ORDER BY RAND() LIMIT 1");
    $question = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($question) {
        // Fetch answers for the selected question
        $stmtAnswers = $kapcsolat->prepare("SELECT answer_text, is_correct FROM answers WHERE question_id = ?");
        $stmtAnswers->execute([$question["id"]]);
        $answers = $stmtAnswers->fetchAll(PDO::FETCH_ASSOC);

        // Shuffle answers
        shuffle($answers);

        $result = [
            "id" => (int)$question["id"],
            "question" => $question["question"],
            "answers" => array_map(function ($ans) {
                return [
                    "text" => $ans["answer_text"],
                    "isCorrect" => (bool)$ans["is_correct"],
                ];
            }, $answers),
        ];

        echo json_encode($result);
    } else {
        echo json_encode(["error" => "No questions found"]);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Hiba a lekérdezés során: " . $e->getMessage()]);
}
?>