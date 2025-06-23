<?php
namespace Models;

class GroupTetel extends Model
{
    protected string $table = 'grouptetel';

    public function link(int $groupId, int $tetelId): int
    {
        return $this->execute(
            "INSERT INTO {$this->table} (group_id, tetel_id)
             VALUES (:gid, :tid)",
            [':gid' => $groupId, ':tid' => $tetelId]
        );
    }

    public function unlink(int $groupId, int $tetelId): int
    {
        return $this->delete("group_id = :gid AND tetel_id = :tid", [
            ':gid' => $groupId,
            ':tid' => $tetelId
        ]);
    }

    public function getTetelsByGroup(int $groupId): array
    {
        return $this->selectAll(
            "SELECT tetel_id FROM {$this->table} WHERE group_id = :gid",
            [':gid' => $groupId]
        );
    }

    public function getGroupsByTetel(int $tetelId): array
    {
        return $this->selectAll(
            "SELECT group_id FROM {$this->table} WHERE tetel_id = :tid",
            [':tid' => $tetelId]
        );
    }
}
