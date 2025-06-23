<?php
namespace Models;

class Group extends Model
{
    protected string $table = 'group';

    public function findAll(): array
    {
        $rows = $this->selectAll("SELECT id, name FROM `{$this->table}`");
        return array_map(fn($r) => [
            'id'   => (int)$r['id'],
            'name' => $r['name']
        ], $rows);
    }

    public function findById(int $id): ?array
    {
        return $this->selectOne(
            "SELECT id, name, public FROM `{$this->table}` WHERE id = :id",
            [':id' => $id]
        );
    }

    public function create(string $name, bool $public = false): int
    {
        return $this->execute(
            "INSERT INTO `{$this->table}` (name, public) VALUES (:name, :public)",
            [':name' => $name, ':public' => (int)$public]
        );
    }

    public function update(int $id, string $name, bool $public): int
    {
        return $this->execute(
            "UPDATE `{$this->table}` SET name = :name, public = :public WHERE id = :id",
            [':name' => $name, ':public' => (int)$public, ':id' => $id]
        );
    }

    public function findPaginatedWithMeta(int $userId, int $limit, int $offset): array
    {
        $stmt = $this->db->prepare("
            SELECT 
                g.id AS gid,
                g.name,
                g.public,
                (SELECT COUNT(*) FROM groupuser gu WHERE gu.group_id = g.id) AS member_count,
                EXISTS (
                    SELECT 1 FROM groupuser gu 
                    WHERE gu.group_id = g.id AND gu.user_id = :uid
                ) AS joined
            FROM `{$this->table}` g
            LIMIT :limit OFFSET :offset
        ");
        $stmt->bindValue(':uid', $userId, \PDO::PARAM_INT);
        $stmt->bindValue(':limit', $limit, \PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, \PDO::PARAM_INT);
        $stmt->execute();

        return array_map(fn($r) => [
            'gid' => (int)$r['gid'],
            'name' => $r['name'],
            'public' => (bool)$r['public'],
            'member_count' => (int)$r['member_count'],
            'joined' => (bool)$r['joined'],
        ], $stmt->fetchAll(\PDO::FETCH_ASSOC));
    }

    public function countAll(): int
    {
        return (int) $this->db
            ->query("SELECT COUNT(*) FROM `{$this->table}`")
            ->fetchColumn();
    }

}
