<?php

namespace App;

use App\Home;
use App\SearchColumn;

class Router{

    public function __construct(){

        $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        $path = trim($path, '/');

        if($path == 'search-columns'){

            $s = new SearchColumn();
            $s->search();
        }else{

            $s = new Home();
            $s->init();
        }
    }
}