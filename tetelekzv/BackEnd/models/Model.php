<?php
namespace Models;

use \PDO;
use \PDOException;

abstract class Model
{
    protected PDO $db;
    protected string $table;

    public function __construct(PDO $db)
    {
        $this->db    = $db;
        if (empty($this->table)) {
            throw new \Exception('Model ' . static::class . ' must set protected $table');
        }
    }

    protected function selectOne(string $sql, array $params = []): ?array
    {
        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row !== false ? $row : null;
    }

    protected function selectAll(string $sql, array $params = []): array
    {
        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    protected function execute(string $sql, array $params = []): int
    {
        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        if (stripos(trim($sql), 'insert') === 0) {
            return (int)$this->db->lastInsertId();
        }
        return $stmt->rowCount();
    }

    public function delete(string $whereSql, array $params = []): int
    {
        $sql = "DELETE FROM {$this->table} WHERE $whereSql";
        return $this->execute($sql, $params);
    }
}
