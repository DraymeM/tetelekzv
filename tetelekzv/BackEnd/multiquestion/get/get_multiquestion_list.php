<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET");

$pdo = require __DIR__ . '/../../core/init.php';
require_once __DIR__ . '/../../models/Model.php';
require_once __DIR__ . '/../../models/Answer.php';
require_once __DIR__ . '/../../models/Question.php';

use Models\Question;

$page  = isset($_GET['page']) ? max(1, (int)$_GET['page']) : 1;
$limit = isset($_GET['limit']) ? max(1, (int)$_GET['limit']) : 35;
$offset = ($page - 1) * $limit;

$questionModel = new Question($pdo);

// Total count
$total = $pdo->query("SELECT COUNT(*) FROM questions")->fetchColumn();

// Paginated results
$stmt = $pdo->prepare("SELECT id, question FROM questions LIMIT :limit OFFSET :offset");
$stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
$stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
$stmt->execute();
$questions = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode([
  "data" => array_map(fn($q) => [
      'id' => (int)$q['id'],
      'question' => $q['question']
  ], $questions),
  "total" => (int)$total,
]);
