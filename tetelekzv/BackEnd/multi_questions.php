<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *"); // Restrict in production
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

$jsonFile = __DIR__ . "/../public/multi_questions.json"; // Path to JSON file

// Read current data
if (file_exists($jsonFile)) {
    $questions = json_decode(file_get_contents($jsonFile), true);
    if ($questions === null) {
        $questions = [];
    }
} else {
    $questions = [];
}

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
        echo json_encode(["error" => "Invalid question or answers"]);
        exit;
    }

    // Check for at least one correct answer
    $hasCorrect = array_reduce($data["answers"], fn($carry, $ans) => $carry || $ans["isCorrect"], false);
    if (!$hasCorrect) {
        http_response_code(400);
        echo json_encode(["error" => "At least one answer must be correct"]);
        exit;
    }

    // Generate new ID
    $maxId = $questions ? max(array_column($questions, "id")) : 0;
    $newQuestion = [
        "id" => $maxId + 1,
        "question" => $data["question"],
        "answers" => $data["answers"],
    ];

    // Append and save
    $questions[] = $newQuestion;
    if (file_put_contents($jsonFile, json_encode($questions, JSON_PRETTY_PRINT)) === false) {
        http_response_code(500);
        echo json_encode(["error" => "Failed to save question"]);
        exit;
    }

    echo json_encode($newQuestion);
    exit;
}

http_response_code(400);
echo json_encode(["error" => "Invalid request"]);
?>