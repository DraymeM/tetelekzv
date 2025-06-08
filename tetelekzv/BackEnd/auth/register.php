<?php
header("Access-Control-Allow-Methods: POST");

$pdo = require __DIR__ . '/../core/init.php';
require_once __DIR__ . '/../models/Model.php';
require_once __DIR__ . '/../models/User.php';

use Models\User;

$data = json_decode(file_get_contents("php://input"), true);
$username = trim($data['username'] ?? '');
$email = trim($data['email'] ?? '');
$password = $data['password'] ?? '';

if (!$username || !$password || !$email) {
    http_response_code(400);
    echo json_encode(["error" => "Missing username, email or password"]);
    exit;
}

try {
    $userModel = new User($pdo);

    if ($userModel->findByUsername($username)) {
        http_response_code(409);
        echo json_encode(["error" => "Username already taken"]);
        exit;
    }

    if ($userModel->findByEmail($email)) {
        http_response_code(409);
        echo json_encode(["error" => "Email already registered"]);
        exit;
    }

    $userModel->create($username, $password, $email);
    $subject = "Welcome to Tiomi!";
    $htmlMessage = "
    <!doctype html>
    <html lang='en'>
      <head>
        <meta charset='UTF-8' />
        <title>Welcome to Tiomi</title>
      </head>
      <body style='font-family: Arial, sans-serif; background: #f7f7f7; padding: 20px; color: #333;'>
        <div style='max-width: 600px; margin: auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);'>
          <h2 style='color: #1ab474'>Welcome to Tiomi!</h2>
          <p>Hi <strong style='color: #1ab474'>" . htmlspecialchars($username) . "</strong>,</p>
          <p>
            Thank you for registering with
            <strong style='color: #1ab474'>Tiomi</strong>. We're excited to have you
            on board.
          </p>
          <p>Click the button below to login and get started:</p>
          <p style='text-align: center'>
            <a
              href='https://danielmarkus.web.elte.hu/tetelekzv/#/login'
              style='display: inline-block; padding: 12px 24px; background-color: #1ab474;
                     color: #ffffff; text-decoration: none; border-radius: 10px; font-weight: bold;'>
              Login
            </a>
          </p>
          <p style='margin-top: 30px'>
            Cheers,<br /><strong style='color: #1ab474'>Dray</strong>
          </p>
        </div>
      </body>
    </html>
    ";

    // 📩 Email headers for HTML
    $headers = "MIME-Version: 1.0\r\n";
    $headers .= "Content-type: text/html; charset=UTF-8\r\n";
    $headers .= "From: noreply@tiomi.com\r\n";
    $headers .= "Reply-To: noreply@tiomi.com\r\n";

    if (@mail($email, $subject, $htmlMessage, $headers)) {
        echo json_encode(["success" => true, "message" => "Registration successful, email sent."]);
    } else {
        echo json_encode(["success" => true, "message" => "Registration successful, but email failed."]);
    }

} catch (InvalidArgumentException $e) {
    http_response_code(400);
    echo json_encode(["error" => $e->getMessage()]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Server error, please try again later"]);
}
