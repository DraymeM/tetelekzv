<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: https://danielmarkus.web.elte.hu");
header("Access-Control-Allow-Methods: DELETE");
header("Access-Control-Allow-Headers: Content-Type");

require_once __DIR__ . '/connect.php';
ini_set('display_errors', 1);
error_reporting(E_ALL);

try {
    if ($_SERVER["REQUEST_METHOD"] !== "DELETE") {
        http_response_code(405);
        echo json_encode(["error" => "Csak DELETE kérés engedélyezett."]);
        exit;
    }

    $data = json_decode(file_get_contents("php://input"), true);
    if (!isset($data['id']) || !is_numeric($data['id'])) {
        http_response_code(400);
        echo json_encode(["error" => "Érvénytelen tétel ID."]);
        exit;
    }

    $tetelId = (int)$data['id'];

    // Start transaction
    $kapcsolat->beginTransaction();

    try {
        // Delete subsections
        $stmt = $kapcsolat->prepare("
            DELETE subsection
            FROM subsection
            INNER JOIN section ON subsection.section_id = section.id
            WHERE section.tetel_id = ?
        ");
        $stmt->execute([$tetelId]);

        // Delete sections
        $stmt = $kapcsolat->prepare("DELETE FROM section WHERE tetel_id = ?");
        $stmt->execute([$tetelId]);

        // Delete flashcards
        $stmt = $kapcsolat->prepare("DELETE FROM flashcard WHERE tetel_id = ?");
        $stmt->execute([$tetelId]);

        // Delete összegzés and tetel
        $stmt = $kapcsolat->prepare("
            DELETE t, o
            FROM tetel t
            LEFT JOIN osszegzes o ON t.osszegzes_id = o.id
            WHERE t.id = ?
        ");
        $stmt->execute([$tetelId]);

        $kapcsolat->commit();
        echo json_encode(["success" => true]);
    } catch (Exception $e) {
        $kapcsolat->rollBack();
        throw $e;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Adatbázis hiba: " . $e->getMessage()]);
}
?>