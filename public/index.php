<?php

ini_set('max_execution_time', 0);
ini_set('default_socket_timeout', 0);
set_time_limit(0);

require __DIR__ . '/../vendor/autoload.php';

use App\Router;
new Router;