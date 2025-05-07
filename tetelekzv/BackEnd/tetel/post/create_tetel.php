<?php
require_once __DIR__ . '/../../core/bootstrap.php';
ini_set('display_errors', 1);
error_reporting(E_ALL);

try {
    if ($_SERVER["REQUEST_METHOD"] !== "POST") {
        http_response_code(405);
        echo json_encode(["error" => "Csak POST kérés engedélyezett."]);
        exit;
    }

    $data = json_decode(file_get_contents("php://input"), true);

    if (
        !isset($data["name"], $data["osszegzes"], $data["sections"], $data["flashcards"]) ||
        !is_string($data["name"]) || !is_string($data["osszegzes"]) ||
        !is_array($data["sections"]) || !is_array($data["flashcards"])
    ) {
        http_response_code(400);
        echo json_encode(["error" => "Hiányzó vagy érvénytelen mezők."]);
        exit;
    }

    $kapcsolat->beginTransaction();

    // 1. Insert into osszegzes
    $stmt = $kapcsolat->prepare("INSERT INTO osszegzes (content) VALUES (?)");
    $stmt->execute([$data["osszegzes"]]);
    $osszegzesId = $kapcsolat->lastInsertId();

    // 2. Insert into tetel
    $stmt = $kapcsolat->prepare("INSERT INTO tetel (name, osszegzes_id) VALUES (?, ?)");
    $stmt->execute([$data["name"], $osszegzesId]);
    $tetelId = $kapcsolat->lastInsertId();

    // 3. Insert sections and subsections
    $sectionStmt = $kapcsolat->prepare("INSERT INTO section (tetel_id, content) VALUES (?, ?)");
    $subsectionStmt = $kapcsolat->prepare("INSERT INTO subsection (section_id, title, description) VALUES (?, ?, ?)");

    foreach ($data["sections"] as $section) {
        if (!isset($section["content"]) || !is_string($section["content"])) continue;

        $sectionStmt->execute([$tetelId, $section["content"]]);
        $sectionId = $kapcsolat->lastInsertId();

        if (!empty($section["subsections"]) && is_array($section["subsections"])) {
            foreach ($section["subsections"] as $sub) {
                if (!isset($sub["title"], $sub["description"])) continue;
                $subsectionStmt->execute([$sectionId, $sub["title"], $sub["description"]]);
            }
        }
    }

    // 4. Insert flashcards
    $flashcardStmt = $kapcsolat->prepare("INSERT INTO flashcard (tetel_id, question, answer) VALUES (?, ?, ?)");
    foreach ($data["flashcards"] as $card) {
        if (!isset($card["question"], $card["answer"])) continue;
        $flashcardStmt->execute([$tetelId, $card["question"], $card["answer"]]);
    }

    $kapcsolat->commit();
    echo json_encode(["success" => true, "tetel_id" => $tetelId]);
} catch (Exception $e) {
    if ($kapcsolat->inTransaction()) {
        $kapcsolat->rollBack();
    }
    http_response_code(500);
    echo json_encode(["error" => "Adatbázis hiba: " . $e->getMessage()]);
}
?>
