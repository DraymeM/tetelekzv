<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: https://danielmarkus.web.elte.hu");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

require_once __DIR__ . '/../../connect.php';
ini_set('display_errors', 1);
error_reporting(E_ALL);

try {
    if ($_SERVER["REQUEST_METHOD"] !== "GET") {
        http_response_code(405);
        echo json_encode(["error" => "Csak GET kérés engedélyezett."]);
        exit;
    }

    if (!isset($_GET['id']) || !is_numeric($_GET['id'])) {
        http_response_code(400);
        echo json_encode(["error" => "Érvénytelen kérdés ID."]);
        exit;
    }

    $questionId = (int)$_GET['id'];

    // Correct table: 'questions'
    $stmt = $kapcsolat->prepare("SELECT id, question FROM questions WHERE id = ?");
    $stmt->execute([$questionId]);
    $question = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$question) {
        http_response_code(404);
        echo json_encode(["error" => "Kérdés nem található."]);
        exit;
    }

    // Correct table: 'answers', column: answer_text
    $stmtAnswers = $kapcsolat->prepare("SELECT id, answer_text, is_correct FROM answers WHERE question_id = ?");
    $stmtAnswers->execute([$questionId]);
    $answers = $stmtAnswers->fetchAll(PDO::FETCH_ASSOC);

    $result = [
        "id" => (int)$question["id"],
        "question" => $question["question"],
        "answers" => array_map(function ($ans) {
            return [
                "id" => (int)$ans["id"],
                "text" => $ans["answer_text"],
                "isCorrect" => (bool)$ans["is_correct"],
            ];
        }, $answers)
    ];

    echo json_encode($result);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Hiba a lekérdezés során: " . $e->getMessage()]);
}
?>
