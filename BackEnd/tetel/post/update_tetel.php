<?php
session_start();
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: https://danielmarkus.web.elte.hu");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
if (!isset($_SESSION['authenticated']) || $_SESSION['authenticated'] !== true) {
    http_response_code(401);
    echo json_encode(["authenticated" => false]);
    exit;
}
require_once __DIR__ . '/../../connect.php';
ini_set('display_errors', 1);
error_reporting(E_ALL);

try {
    if ($_SERVER["REQUEST_METHOD"] !== "POST") {
        http_response_code(405);
        echo json_encode(["error" => "Csak POST kérés engedélyezett."]);
        exit;
    }

    $input = json_decode(file_get_contents("php://input"), true);
    $tetelId = $_GET["id"] ?? null;

    if (!$tetelId || !is_numeric($tetelId)) {
        http_response_code(400);
        echo json_encode(["error" => "Érvénytelen ID."]);
        exit;
    }

    $kapcsolat->beginTransaction();

    // Update summary
    $stmt = $kapcsolat->prepare("SELECT osszegzes_id FROM tetel WHERE id = ?");
    $stmt->execute([$tetelId]);
    $osszegzesId = $stmt->fetchColumn();

    if ($osszegzesId) {
        $stmt = $kapcsolat->prepare("UPDATE osszegzes SET content = ? WHERE id = ?");
        $stmt->execute([$input["osszegzes"], $osszegzesId]);
    } else {
        $stmt = $kapcsolat->prepare("INSERT INTO osszegzes (content) VALUES (?)");
        $stmt->execute([$input["osszegzes"]]);
        $osszegzesId = $kapcsolat->lastInsertId();
        $stmt = $kapcsolat->prepare("UPDATE tetel SET osszegzes_id = ? WHERE id = ?");
        $stmt->execute([$osszegzesId, $tetelId]);
    }

    // Update tetel name
    $stmt = $kapcsolat->prepare("UPDATE tetel SET name = ? WHERE id = ?");
    $stmt->execute([$input["name"], $tetelId]);

    // Clear and reinsert sections
    $kapcsolat->prepare("DELETE FROM subsection WHERE section_id IN (SELECT id FROM section WHERE tetel_id = ?)")->execute([$tetelId]);
    $kapcsolat->prepare("DELETE FROM section WHERE tetel_id = ?")->execute([$tetelId]);

    foreach ($input["sections"] as $section) {
        $stmt = $kapcsolat->prepare("INSERT INTO section (tetel_id, content) VALUES (?, ?)");
        $stmt->execute([$tetelId, $section["content"]]);
        $sectionId = $kapcsolat->lastInsertId();

        foreach ($section["subsections"] as $sub) {
            $stmt = $kapcsolat->prepare("INSERT INTO subsection (section_id, title, description) VALUES (?, ?, ?)");
            $stmt->execute([$sectionId, $sub["title"], $sub["description"]]);
        }
    }

    // Clear and reinsert flashcards
    $kapcsolat->prepare("DELETE FROM flashcard WHERE tetel_id = ?")->execute([$tetelId]);

    foreach ($input["flashcards"] as $fc) {
        $stmt = $kapcsolat->prepare("INSERT INTO flashcard (tetel_id, question, answer) VALUES (?, ?, ?)");
        $stmt->execute([$tetelId, $fc["question"], $fc["answer"]]);
    }

    $kapcsolat->commit();

    echo json_encode(["success" => true]);

} catch (Exception $e) {
    $kapcsolat->rollBack();
    http_response_code(500);
    echo json_encode(["error" => "Szerver hiba: " . $e->getMessage()]);
}
