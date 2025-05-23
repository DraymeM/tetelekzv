<?php
namespace Models;

use \Exception;
require_once __DIR__ . '/Osszegzes.php';
require_once __DIR__ . '/Flashcard.php';
require_once __DIR__ . '/Section.php';
require_once __DIR__ . '/Subsection.php';
class Tetel extends Model
{
    protected string $table = 'tetel';
    private Osszegzes  $oss;
    private Section    $sec;
    private Subsection $sub;
    private Flashcard  $fc;

    public function __construct(\PDO $db)
    {
        parent::__construct($db);
        $this->oss = new Osszegzes($db);
        $this->sec = new Section($db);
        $this->sub = new Subsection($db);
        $this->fc  = new Flashcard($db);
    }

    public function findAll(): array
    {
        $rows = $this->selectAll("SELECT id, name FROM {$this->table}");
        return array_map(fn($r) => [
            'id'   => (int)$r['id'],
            'name' => $r['name']
        ], $rows);
    }

    public function findById(int $id): ?array
    {
        $t = $this->selectOne(
            "SELECT id, name 
             FROM {$this->table} 
             WHERE id = :id",
            [':id' => $id]
        );
        if (! $t) {
            return null;
        }

        $oss      = $this->oss->findByTetelId($id);
        $secs     = $this->sec->findByTetelId($id);
        $qSub     = [];
        foreach ($secs as $s) {
            $subs = $this->sub->findBySectionId($s['id']);
            $qSub[] = array_merge($s, ['subsections' => $subs]);
        }
        $cards    = $this->fc->findByTetelId($id);

        return [
            'tetel'     => ['id' => (int)$t['id'], 'name' => $t['name']],
            'osszegzes' => $oss,
            'sections'  => $qSub,
            'questions' => $cards
        ];
    }

    public function createFull(array $data): int
    {
        $this->db->beginTransaction();

        $tid = $this->execute(
            "INSERT INTO {$this->table} (name) VALUES (:n)",
            [':n' => $data['name']]
        );

        $this->oss->create($tid, $data['osszegzes']);

        $secIds = $this->sec->createBulk($tid, $data['sections']);
        foreach ($secIds as $i => $sid) {
            if (!empty($data['sections'][$i]['subsections'])) {
                $this->sub->createBulk(
                    $sid,
                    $data['sections'][$i]['subsections']
                );
            }
        }

        $this->fc->createBulk($tid, $data['flashcards']);

        $this->db->commit();
        return $tid;
    }

    public function deleteById(int $id): void
    {
        $this->db->beginTransaction();
        $this->sub->deleteBySectionId($id);
        $this->sec->deleteByTetelId($id);
        $this->fc->deleteByTetelId($id);
        $this->oss->deleteByTetelId($id);
        $this->delete("id = :id", [':id' => $id]);
        $this->db->commit();
    }

    public function updateFull(int $id, array $data): void
    {
        $this->db->beginTransaction();


        $this->execute(
            "UPDATE {$this->table} 
             SET name = :n 
             WHERE id = :id",
            [':n' => $data['name'], ':id' => $id]
        );

        $o = $this->oss->findByTetelId($id);
        if ($o) {
            $this->oss->update($o['id'], $data['osszegzes']);
        } else {
            $this->oss->create($id, $data['osszegzes']);
        }

        $this->sub->deleteBySectionId($id);
        $this->sec->deleteByTetelId($id);
        $secIds = $this->sec->createBulk($id, $data['sections']);
        foreach ($secIds as $i => $sid) {
            if (!empty($data['sections'][$i]['subsections'])) {
                $this->sub->createBulk(
                    $sid,
                    $data['sections'][$i]['subsections']
                );
            }
        }

        $this->fc->deleteByTetelId($id);
        $this->fc->createBulk($id, $data['flashcards']);

        $this->db->commit();
    }

    public function findPaginated(int $limit, int $offset): array
{
    $stmt = $this->db->prepare(
        "SELECT id, name FROM {$this->table} LIMIT :limit OFFSET :offset"
    );
    $stmt->bindValue(':limit', $limit, \PDO::PARAM_INT);
    $stmt->bindValue(':offset', $offset, \PDO::PARAM_INT);
    $stmt->execute();

    return array_map(fn($r) => [
        'id' => (int)$r['id'],
        'name' => $r['name']
    ], $stmt->fetchAll(\PDO::FETCH_ASSOC));
}

public function countAll(): int
{
    return (int) $this->db
        ->query("SELECT COUNT(*) FROM {$this->table}")
        ->fetchColumn();
}
}
