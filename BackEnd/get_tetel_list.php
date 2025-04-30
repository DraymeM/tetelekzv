<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: https://danielmarkus.web.elte.hu");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

require_once __DIR__ . '/connect.php';

try {
    $stmt = $kapcsolat->query("SELECT id, name FROM tetel");
    $tetelek = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $result = array_map(function ($tetel) {
        return [
            "id" => (int)$tetel["id"],
            "name" => $tetel["name"]
        ];
    }, $tetelek);

    echo json_encode($result);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Hiba a lekérdezés során: " . $e->getMessage()]);
}
?>
