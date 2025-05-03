<?php
session_start();
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: https://danielmarkus.web.elte.hu");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true"); 

// Authentication check
if (!isset($_SESSION['authenticated']) || $_SESSION['authenticated'] !== true) {
    http_response_code(401);
    echo json_encode(["authenticated" => false]);
    exit;
}
require_once __DIR__ . '/../../connect.php';
ini_set('display_errors', 1);
error_reporting(E_ALL);

try {
    $input = json_decode(file_get_contents("php://input"), true);
    $subsectionId = $input["subsectionId"];

    if (!$subsectionId || !is_numeric($subsectionId)) {
        http_response_code(400);
        echo json_encode(["error" => "Érvénytelen al-szekció ID."]);
        exit;
    }

    // Delete the subsection
    $stmt = $kapcsolat->prepare("DELETE FROM subsection WHERE id = ?");
    $stmt->execute([$subsectionId]);

    echo json_encode(["success" => true]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Szerver hiba: " . $e->getMessage()]);
}
