<?php

$port = $argv[1] ?? 8543;
$openBrowser = $argv[2] ?? false;
$address = "http://localhost:$port";

if ($openBrowser) {
    if (PHP_OS_FAMILY === "Windows") {
        exec("start $address");
    } elseif (PHP_OS_FAMILY === "Darwin") {
        exec("open $address");
    } else {
        exec("xdg-open $address");
    }
}

exec("php -S localhost:$port -t public");