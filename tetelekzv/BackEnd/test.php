<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *"); // Restrict in production

echo json_encode(["message" => "Hello from test.php"]);
?>