<?php
namespace Models;

class Osszegzes extends Model
{
    protected string $table = 'osszegzes';

    public function findByTetelId(int $tetelId): ?array
    {
        $row = $this->selectOne(
            "SELECT id, content 
             FROM {$this->table} 
             WHERE tetel_id = :tid",
            [':tid' => $tetelId]
        );
        if (! $row) {
            return null;
        }
        return [
            'id'      => (int)$row['id'],
            'content' => $row['content']
        ];
    }

    public function create(int $tetelId, string $content): int
    {
        return $this->execute(
            "INSERT INTO {$this->table} (tetel_id, content) 
             VALUES (:tid, :c)",
            [':tid' => $tetelId, ':c' => $content]
        );
    }

    public function update(int $id, string $content): int
    {
        return $this->execute(
            "UPDATE {$this->table} 
             SET content = :c 
             WHERE id = :id",
            [':c' => $content, ':id' => $id]
        );
    }

    public function deleteByTetelId(int $tetelId): int
    {
        return $this->execute(
            "DELETE FROM {$this->table} 
             WHERE tetel_id = :tid",
            [':tid' => $tetelId]
        );
    }
}
