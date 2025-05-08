<?php
require_once __DIR__ . '/../../core/bootstrap.php';
header("Access-Control-Allow-Origin: https://danielmarkus.web.elte.hu");
header("Access-Control-Allow-Methods: POST,OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
if ($_SERVER['REQUEST_METHOD']==='OPTIONS') exit;
if ($_SERVER["REQUEST_METHOD"]!=="POST") {
  http_response_code(405);
  exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$id   = $_GET['id'] ?? null;
if (!$id||!is_numeric($id)) {
  http_response_code(400);
  exit;
}

$question = trim($data['question']??'');
$answers  = $data['answers'] ?? [];
if (
  $question==='' ||
  !is_array($answers) ||
  count($answers)!==4 ||
  !array_reduce($answers, fn($c,$a)=>$c&&isset($a['text'],$a['isCorrect'])&&is_string($a['text'])&&is_bool($a['isCorrect']), true)
) {
  http_response_code(400);
  exit;
}
if (!array_reduce($answers, fn($c,$a)=>$c||$a['isCorrect'], false)) {
  http_response_code(400);
  exit;
}

try {
  $kapcsolat->beginTransaction();
  // 1) Update question
  $u = $kapcsolat->prepare("UPDATE questions SET question=? WHERE id=?");
  $u->execute([$question, $id]);

  // 2) Fetch exactly four existing answer IDs in order
  $f = $kapcsolat->prepare("
    SELECT id FROM answers
    WHERE question_id=? ORDER BY id ASC LIMIT 4
  ");
  $f->execute([$id]);
  $ids = $f->fetchAll(PDO::FETCH_COLUMN);
  if (count($ids)!==4) {
    throw new Exception("Expected 4 answers, found ".count($ids));
  }

  // 3) Update each answer
  $up = $kapcsolat->prepare("
    UPDATE answers
    SET answer_text=?, is_correct=?
    WHERE id=? AND question_id=?
  ");
  foreach ($ids as $i=>$ansId) {
    $ans = $answers[$i];
    $up->execute([
      $ans['text'],
      $ans['isCorrect'] ? 1 : 0,
      $ansId,
      $id
    ]);
  }

  $kapcsolat->commit();
  echo json_encode(['success'=>true]);

} catch (Exception $e) {
  if ($kapcsolat->inTransaction()) $kapcsolat->rollBack();
  http_response_code(500);
  echo json_encode(['error'=>$e->getMessage()]);
}
