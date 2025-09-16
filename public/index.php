<?php

ini_set('max_execution_time', 0);
ini_set('default_socket_timeout', 0);
set_time_limit(0);

require __DIR__ . '/../vendor/autoload.php';

$allowed_origins = [
    'http://localhost:8543',
    'http://localhost:8501',
    'http://localhost:8502',
    'http://localhost:8503',
    'http://localhost:8504',
    'http://localhost:8505',
    'http://localhost:8506',
    'http://localhost:8507',
    'http://localhost:8508',
    'http://localhost:8509',
    'http://localhost:8510'
];

if (isset($_SERVER['HTTP_ORIGIN']) && in_array($_SERVER['HTTP_ORIGIN'], $allowed_origins)) {
    header('Access-Control-Allow-Origin: ' . $_SERVER['HTTP_ORIGIN']);
}
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

use App\Router;
new Router;