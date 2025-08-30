<?php

$address = "http://localhost:8005";

// Abre o navegador
if (PHP_OS_FAMILY === "Windows") {
    exec("start $address");
} elseif (PHP_OS_FAMILY === "Darwin") {
    exec("open $address");
} else {
    exec("xdg-open $address");
}

// Sobe o servidor embutido
$cmd = "php -S localhost:8005 -t public";
proc_open($cmd, [], $pipes);