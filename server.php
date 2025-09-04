<?php

$address = "http://localhost:8544";

if (PHP_OS_FAMILY === "Windows") {
    exec("start $address");
} elseif (PHP_OS_FAMILY === "Darwin") {
    exec("open $address");
} else {
    exec("xdg-open $address");
}

exec("php -S localhost:8544 -t public");