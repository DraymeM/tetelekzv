<?php
namespace Models;

class Section extends Model
{
    protected string $table = 'section';

    public function findByTetelId(int $tetelId): array
    {
        $rows = $this->selectAll(
            "SELECT id, content 
             FROM {$this->table} 
             WHERE tetel_id = :tid",
            [':tid' => $tetelId]
        );
        return array_map(fn($r) => [
            'id'         => (int)$r['id'],
            'content'    => $r['content']
        ], $rows);
    }

    public function createBulk(int $tetelId, array $sections): array
    {
        $stmt = $this->db->prepare(
            "INSERT INTO {$this->table} (tetel_id, content) 
             VALUES (:tid, :c)"
        );
        $ids = [];
        foreach ($sections as $s) {
            $stmt->execute([
                ':tid' => $tetelId,
                ':c'   => $s['content']
            ]);
            $ids[] = (int)$this->db->lastInsertId();
        }
        return $ids;
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
