<?php

namespace App;

use App\Home;
use App\SearchColumn;
use App\Controllers\RelationshipAnalyser;

class Router {

    private $_roads = [
        'search-columns' => \App\SearchColumn::class,
        'relationship-analyser' => \App\Controllers\RelationshipAnalyser::class,
        'upload-zip' => \App\Controllers\UploadZipController::class,
        'view-bytea' => \App\Controllers\ViewByteaController::class,
        'service' => \App\Controllers\ServiceController::class,
    ];

    public function __construct() {

        $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        $path = trim($path, '/');

        $parts = explode('/', $path);

        $controllerKey = $parts[0] ?? '';
        $method = $parts[1] ?? 'index';
        $params = array_slice($parts, 2);

        if (isset($this->_roads[$controllerKey])) {

            $className = $this->_roads[$controllerKey];
            $controller = new $className;

            if ($method) {
                $method = lcfirst(str_replace(' ', '', ucwords(str_replace('-', ' ', $method))));
            }

            if (method_exists($controller, $method)) {
                call_user_func_array([$controller, $method], $params);
            } else {

                if (method_exists($controller, 'index')) {
                    call_user_func_array([$controller, 'index'], $params);
                } else {
                    http_response_code(404);
                    echo "Método não encontrado";
                }
            }

        } else {
            $home = new Home();
            $home->init();
        }
    }
}