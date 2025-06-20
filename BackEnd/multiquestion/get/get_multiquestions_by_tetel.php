<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET");

$pdo = require __DIR__ . '/../../core/init.php';
require_once __DIR__ . '/../../models/Model.php';
require_once __DIR__ . '/../../models/Answer.php';
require_once __DIR__ . '/../../models/Question.php';

use Models\Question;

$tetel_id = isset($_GET['tetel_id']) ? (int)$_GET['tetel_id'] : 0;
$page     = isset($_GET['page']) ? max(1, (int)$_GET['page']) : 1;
$limit    = isset($_GET['limit']) ? max(1, (int)$_GET['limit']) : 35;
$offset   = ($page - 1) * $limit;

if ($tetel_id <= 0) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid tetel_id']);
    exit;
}

$questionModel = new Question($pdo);

// Total count for the specific tetel_id
$stmt = $pdo->prepare("SELECT COUNT(*) FROM questions WHERE tetel_id = :tetel_id");
$stmt->execute([':tetel_id' => $tetel_id]);
$total = (int)$stmt->fetchColumn();

// Paginated results
$stmt = $pdo->prepare(
    "SELECT id, question 
     FROM questions 
     WHERE tetel_id = :tetel_id 
     LIMIT :limit OFFSET :offset"
);
$stmt->bindValue(':tetel_id', $tetel_id, PDO::PARAM_INT);
$stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
$stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
$stmt->execute();
$questions = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode([
    "data" => array_map(fn($q) => [
        'id' => (int)$q['id'],
        'question' => $q['question']
    ], $questions),
    "total" => $total,
]);