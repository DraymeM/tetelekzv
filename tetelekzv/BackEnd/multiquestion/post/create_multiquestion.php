<?php
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/error.log');
    use Models\Question;
try {
    $pdo = require __DIR__ . '/../../core/init.php';
    if (!$pdo instanceof PDO) {
        throw new Exception("Failed to initialize database connection");
    }

    require_once __DIR__ . '/../../models/Model.php';
    require_once __DIR__ . '/../../models/Answer.php';
    require_once __DIR__ . '/../../models/Question.php';



    $data = json_decode(file_get_contents('php://input'), true);
    $tetel_id = isset($_GET['tetelid']) && is_numeric($_GET['tetelid']) ? (int)$_GET['tetelid'] : null;

    error_log("Request received: tetel_id=$tetel_id, payload=" . json_encode($data));

    if (
        empty($data['question']) ||
        !is_string($data['question']) ||
        empty($data['answers']) ||
        !is_array($data['answers']) ||
        is_null($tetel_id) ||
        $tetel_id <= 0
    ) {
        http_response_code(400);
        error_log("Validation failed: Invalid question, answers, or tetel_id");
        exit(json_encode(['error' => 'Érvénytelen kérdés, válaszok vagy tétel ID']));
    }

    // Validate answers format
    foreach ($data['answers'] as $index => $answer) {
        if (!isset($answer['text']) || !isset($answer['isCorrect'])) {
            http_response_code(400);
            error_log("Invalid answer format at index $index");
            exit(json_encode(['error' => "Érvénytelen válasz formátum at index $index"]));
        }
    }

    $hasCorrect = array_reduce(
        $data['answers'],
        fn($c, $a) => $c || (!empty($a['isCorrect'])),
        false
    );
    if (!$hasCorrect) {
        http_response_code(400);
        error_log("No correct answer provided");
        exit(json_encode(['error' => 'Legalább egy válasznak helyesnek kell lennie']));
    }

    // Validate tetel_id exists
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM tetel WHERE id = :tetel_id");
    if (!$stmt) {
        throw new Exception("Failed to prepare tetel query");
    }
    $stmt->execute([':tetel_id' => $tetel_id]);
    if ($stmt->fetchColumn() == 0) {
        http_response_code(400);
        error_log("Invalid tetel_id: $tetel_id");
        exit(json_encode(['error' => "Érvénytelen tétel ID: $tetel_id"]));
    }

    $qm = new Question($pdo);
    $newId = $qm->createWithAnswers($data['question'], $data['answers'], $tetel_id);
    $out = $qm->findById($newId);
    if (!$out) {
        throw new Exception("Failed to retrieve created question ID: $newId");
    }
    error_log("Question created successfully: ID=$newId");
    echo json_encode($out);

} catch (InvalidArgumentException $e) {
    http_response_code(400);
    error_log("InvalidArgumentException: " . $e->getMessage());
    echo json_encode(['error' => $e->getMessage()]);

} catch (Exception $e) {
    http_response_code(500);
    error_log("Exception: " . $e->getMessage() . "\nStack trace: " . $e->getTraceAsString());
    echo json_encode(['error' => $e->getMessage()]);
}