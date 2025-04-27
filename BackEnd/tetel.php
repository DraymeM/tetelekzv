<?php
// Allow cross-origin requests
header("Access-Control-Allow-Origin: http://localhost:3000");  // Allow only localhost:3000 for security
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");  // Allow specific HTTP methods
header("Access-Control-Allow-Headers: Content-Type, Authorization");  // Allow specific headers

// Handling preflight OPTIONS request (important for CORS)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);  // Exit for OPTIONS preflight
}

// Your actual code that serves the JSON data
echo file_get_contents('tetel.json');  // Example of returning JSON data
?>
