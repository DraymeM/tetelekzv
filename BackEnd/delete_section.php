<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: https://danielmarkus.web.elte.hu");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

require_once __DIR__ . '/connect.php';
ini_set('display_errors', 1);
error_reporting(E_ALL);

try {
    $input = json_decode(file_get_contents("php://input"), true);
    $sectionId = $input["sectionId"];

    if (!$sectionId || !is_numeric($sectionId)) {
        http_response_code(400);
        echo json_encode(["error" => "Érvénytelen szekció ID."]);
        exit;
    }

    // Delete related subsections
    $stmt = $kapcsolat->prepare("DELETE FROM subsection WHERE section_id = ?");
    $stmt->execute([$sectionId]);

    // Delete the section
    $stmt = $kapcsolat->prepare("DELETE FROM section WHERE id = ?");
    $stmt->execute([$sectionId]);

    echo json_encode(["success" => true]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Szerver hiba: " . $e->getMessage()]);
}
