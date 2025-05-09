<?php
namespace Models;

class Flashcard extends Model
{
    protected string $table = 'flashcard';

    public function findRandom(): ?array
    {
        $row = $this->selectOne(
            "SELECT id, question, answer 
             FROM {$this->table} 
             ORDER BY RAND() LIMIT 1"
        );
        if (! $row) {
            return null;
        }
        return [
            'id'       => (int)$row['id'],
            'question' => $row['question'],
            'answer'   => $row['answer']
        ];
    }

    public function findByTetelId(int $tetelId): array
    {
        $rows = $this->selectAll(
            "SELECT id, question, answer 
             FROM {$this->table} 
             WHERE tetel_id = :tid",
            [':tid' => $tetelId]
        );
        return array_map(fn($r) => [
            'id'       => (int)$r['id'],
            'question' => $r['question'],
            'answer'   => $r['answer']
        ], $rows);
    }

    public function createBulk(int $tetelId, array $cards): void
    {
        $stmt = $this->db->prepare(
            "INSERT INTO {$this->table} (tetel_id, question, answer) 
             VALUES (:tid, :q, :a)"
        );
        foreach ($cards as $c) {
            $stmt->execute([
                ':tid' => $tetelId,
                ':q'   => $c['question'],
                ':a'   => $c['answer']
            ]);
        }
    }

    public function deleteByTetelId(int $tetelId): int
    {
        return $this->execute(
            "DELETE FROM {$this->table} 
             WHERE tetel_id = :tid",
            [':tid' => $tetelId]
        );
    }

    public function deleteById(int $id): int
    {
        return $this->delete("id = :id", [':id' => $id]);
    }
}
