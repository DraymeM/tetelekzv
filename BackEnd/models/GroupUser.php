<?php
namespace Models;

class GroupUser extends Model
{
    protected string $table = 'groupuser';

    public function addUserToGroup(int $userId, int $groupId, array $permissions): int
    {
        return $this->execute(
            "INSERT INTO {$this->table} (group_id, user_id, can_create, can_update, can_delete)
             VALUES (:gid, :uid, :create, :update, :delete)",
            [
                ':gid'    => $groupId,
                ':uid'    => $userId,
                ':create' => (int)($permissions['create'] ?? 0),
                ':update' => (int)($permissions['update'] ?? 0),
                ':delete' => (int)($permissions['delete'] ?? 0),
            ]
        );
    }

    public function getGroupUsers(int $groupId): array
    {
        return $this->selectAll(
            "SELECT user_id, can_create, can_update, can_delete, joined_at
             FROM {$this->table}
             WHERE group_id = :gid",
            [':gid' => $groupId]
        );
    }

    public function getUserPermissions(int $userId, int $groupId): ?array
    {
        return $this->selectOne(
            "SELECT can_create, can_update, can_delete
             FROM {$this->table}
             WHERE user_id = :uid AND group_id = :gid",
            [':uid' => $userId, ':gid' => $groupId]
        );
    }

    public function removeUserFromGroup(int $userId, int $groupId): int
    {
        return $this->delete("user_id = :uid AND group_id = :gid", [
            ':uid' => $userId,
            ':gid' => $groupId
        ]);
    }
}
