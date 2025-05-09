<?php
namespace Models;

use \PDO;
use \Exception;

class Question extends Model
{
    protected string $table = 'questions';
    private Answer $answerModel;

    public function __construct(PDO $db)
    {
        parent::__construct($db);
        $this->answerModel = new Answer($db);
    }

    /** Get a question + its answers */
    public function findById(int $id): ?array
    {
        $q = $this->selectOne(
            "SELECT id, question FROM {$this->table} WHERE id = :id",
            [':id' => $id]
        );
        if (! $q) return null;

        $answers = $this->answerModel->findByQuestionId($id);
        return [
            'id'       => (int)$q['id'],
            'question' => $q['question'],
            'answers'  => $answers
        ];
    }

    /** List only questions */
    public function findAll(): array
    {
        $rows = $this->selectAll(
            "SELECT id, question FROM {$this->table}"
        );
        return array_map(fn($r) => [
            'id'       => (int)$r['id'],
            'question' => $r['question']
        ], $rows);
    }

    /** Get a random question + shuffled answers */
    public function findRandom(): ?array
    {
        $q = $this->selectOne(
            "SELECT id, question FROM {$this->table}
             ORDER BY RAND() LIMIT 1"
        );
        if (! $q) return null;

        $detail = $this->findById((int)$q['id']);
        if ($detail) {
            shuffle($detail['answers']);
        }
        return $detail;
    }

    /**
     * Create a question plus its answers in one transaction.
     * Ensures FK integrity.
     */
    public function createWithAnswers(string $text, array $answers): int
    {
        if (count($answers) < 2) {
            throw new Exception("At least two answers required");
        }
        $this->db->beginTransaction();
        $qid = $this->execute(
            "INSERT INTO {$this->table} (question) VALUES (:q)",
            [':q' => $text]
        );
        $this->answerModel->createBulk($qid, $answers);
        $this->db->commit();
        return $qid;
    }

    /** Delete question and its answers together */
    public function deleteById(int $id): void
    {
        $this->db->beginTransaction();
        $this->answerModel->deleteByQuestionId($id);
        $this->delete("id = :id", [':id' => $id]);
        $this->db->commit();
    }

    /**
     * Update question text + all its answers.
     */
    public function updateWithAnswers(int $id, string $text, array $answers): void
    {
        if (count($answers) < 2) {
            throw new Exception("At least two answers required");
        }
        $this->db->beginTransaction();
        $this->execute(
            "UPDATE {$this->table} SET question = :q WHERE id = :id",
            [':q' => $text, ':id' => $id]
        );
        $this->answerModel->updateBulk($id, $answers);
        $this->db->commit();
    }
}
