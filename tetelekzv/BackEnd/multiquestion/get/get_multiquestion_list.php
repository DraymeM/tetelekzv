<?php
header("Access-Control-Allow-Methods: GET");
$pdo = require __DIR__ . '/../../core/init.php';
require_once __DIR__ . '/../../models/Model.php';
require_once __DIR__ . '/../../models/Answer.php';
require_once __DIR__ . '/../../models/Question.php';

use Models\Question;
$questionModel = new Question($pdo);
$list          = $questionModel->findAll();
echo json_encode($list);
