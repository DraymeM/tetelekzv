<?php
namespace Models;

use \PDO;
use \Exception;

class Answer extends Model
{
    protected string $table = 'answers';

    public function findByQuestionId(int $questionId): array
    {
        $rows = $this->selectAll(
            "SELECT id, answer_text, is_correct
             FROM {$this->table}
             WHERE question_id = :qid",
            [':qid' => $questionId]
        );
        return array_map(fn($r) => [
            'id'        => (int)$r['id'],
            'text'      => $r['answer_text'],
            'isCorrect' => (bool)$r['is_correct']
        ], $rows);
    }
    public function createBulk(int $questionId, array $answers): void
    {
        $stmt = $this->db->prepare(
            "INSERT INTO {$this->table}
             (question_id, answer_text, is_correct)
             VALUES (:qid, :txt, :corr)"
        );
        foreach ($answers as $ans) {
            $stmt->execute([
                ':qid'  => $questionId,
                ':txt'  => $ans['text'],
                ':corr' => $ans['isCorrect'] ? 1 : 0
            ]);
        }
    }

    public function deleteByQuestionId(int $questionId): int
    {
        return $this->execute(
            "DELETE FROM {$this->table} WHERE question_id = :qid",
            [':qid' => $questionId]
        );
    }

    public function updateBulk(int $questionId, array $answers): void
    {
        $ids = $this->selectAll(
            "SELECT id FROM {$this->table}
             WHERE question_id = :qid
             ORDER BY id ASC",
            [':qid' => $questionId]
        );
        if (count($ids) !== count($answers)) {
            throw new Exception("Mismatched answer count");
        }

        $stmt = $this->db->prepare(
            "UPDATE {$this->table}
             SET answer_text = :txt, is_correct = :corr
             WHERE id = :aid AND question_id = :qid"
        );
        foreach ($ids as $i => $row) {
            $stmt->execute([
                ':txt'  => $answers[$i]['text'],
                ':corr' => $answers[$i]['isCorrect'] ? 1 : 0,
                ':aid'  => $row['id'],
                ':qid'  => $questionId
            ]);
        }
    }
}
