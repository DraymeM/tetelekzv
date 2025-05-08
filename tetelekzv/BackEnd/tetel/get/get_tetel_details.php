<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: https://danielmarkus.web.elte.hu");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

require_once __DIR__ . '/../../connect.php';
ini_set('display_errors', 1);
error_reporting(E_ALL);

try {
    if ($_SERVER["REQUEST_METHOD"] !== "GET") {
        http_response_code(405);
        echo json_encode(["error" => "Csak GET kérés engedélyezett."]);
        exit;
    }

    if (!isset($_GET['id']) || !is_numeric($_GET['id'])) {
        http_response_code(400);
        echo json_encode(["error" => "Érvénytelen tétel ID."]);
        exit;
    }

    $tetelId = (int)$_GET['id'];

    // Get main tetel data
    $stmt = $kapcsolat->prepare("
        SELECT t.id, t.name 
        FROM tetel t
        WHERE t.id = ?
    ");
    $stmt->execute([$tetelId]);
    $tetel = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$tetel) {
        http_response_code(404);
        echo json_encode(["error" => "Tétel nem található."]);
        exit;
    }

    // Get corresponding osszegzes data (now in osszegzes table)
    $osszegzes = null;
    $stmt = $kapcsolat->prepare("
        SELECT o.id, o.content 
        FROM osszegzes o 
        WHERE o.tetel_id = ?
    ");
    $stmt->execute([$tetelId]);
    $osszegzes = $stmt->fetch(PDO::FETCH_ASSOC);

    // Get sections and subsections
    $sections = [];
    $stmt = $kapcsolat->prepare("
        SELECT s.id, s.content 
        FROM section s 
        WHERE s.tetel_id = ?
    ");
    $stmt->execute([$tetelId]);
    
    while ($section = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $subsections = [];
        $subStmt = $kapcsolat->prepare("
            SELECT id, title, description 
            FROM subsection 
            WHERE section_id = ?
        ");
        $subStmt->execute([$section['id']]);
        
        while ($sub = $subStmt->fetch(PDO::FETCH_ASSOC)) {
            $subsections[] = $sub;
        }
        
        $section['subsections'] = $subsections ?: null;
        $sections[] = $section;
    }

    // Get flashcards
    $flashcards = [];
    $stmt = $kapcsolat->prepare("
        SELECT id, question, answer 
        FROM flashcard 
        WHERE tetel_id = ?
    ");
    $stmt->execute([$tetelId]);
    
    while ($card = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $flashcards[] = $card;
    }

    // Build response
    echo json_encode([
        "tetel" => [
            "id" => (int)$tetel['id'],
            "name" => $tetel['name']
        ],
        "osszegzes" => $osszegzes ? [
            "id" => (int)$osszegzes['id'],
            "content" => $osszegzes['content'] ?? ''
        ] : null,
        "sections" => $sections ?: [],
        "questions" => $flashcards ?: null
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Adatbázis hiba: " . $e->getMessage()]);
}
?>
