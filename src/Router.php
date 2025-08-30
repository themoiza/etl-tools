<?php

namespace App;

use App\Home;
use App\SearchColumn;
use App\Controllers\RelationshipAnalyser;

class Router{

    private $_roads = [
        'search-columns' => \App\SearchColumn::class,
        'relationship-analyser' => \App\Controllers\RelationshipAnalyser::class,
    ];

    public function __construct(){

        $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        $path = trim($path, '/');

        if(isset($this->_roads[$path])){

            $className = $this->_roads[$path];

            $s = new $className;
            $s->index();

        }else{

            $s = new Home();
            $s->init();
        }
    }
}