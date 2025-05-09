<?php
namespace Models;
require_once __DIR__ . '/Subsection.php';
class Subsection extends Model
{
    protected string $table = 'subsection';

    public function findBySectionId(int $sectionId): array
    {
        $rows = $this->selectAll(
            "SELECT id, title, description 
             FROM {$this->table} 
             WHERE section_id = :sid",
            [':sid' => $sectionId]
        );
        return array_map(fn($r) => [
            'id'          => (int)$r['id'],
            'title'       => $r['title'],
            'description' => $r['description']
        ], $rows);
    }

    public function createBulk(int $sectionId, array $subs): void
    {
        $stmt = $this->db->prepare(
            "INSERT INTO {$this->table}
             (section_id, title, description)
             VALUES (:sid, :t, :d)"
        );
        foreach ($subs as $s) {
            $stmt->execute([
                ':sid' => $sectionId,
                ':t'   => $s['title'],
                ':d'   => $s['description']
            ]);
        }
    }

    public function deleteBySectionId(int $sectionId): int
    {
        return $this->execute(
            "DELETE FROM {$this->table}
             WHERE section_id = :sid",
            [':sid' => $sectionId]
        );
    }

    public function deleteById(int $id): int
    {
        return $this->delete("id = :id", [':id' => $id]);
    }
}
