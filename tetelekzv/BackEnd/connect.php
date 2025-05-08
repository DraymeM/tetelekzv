<?php

$useDev = false;//false on prod true on dev

$config = require $useDev ? __DIR__ . '/dev.env.php' : __DIR__ . '/env.php';

function kapcsolodas($kapcsolati_szoveg, $felhasznalonev = '', $jelszo = '') {
    $pdo = new PDO($kapcsolati_szoveg, $felhasznalonev, $jelszo);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->exec("SET NAMES latin1"); 
    return $pdo;;
}

$dsn = 'mysql:host=' . $config['DB_HOST'] . ';dbname=' . $config['DB_NAME'] . ';charset=utf8mb4';
$kapcsolat = kapcsolodas($dsn, $config['DB_USER'], $config['DB_PASS']);
