<?php

namespace App;

use App\Model\Environment\Env;

class SearchColumn{

    public function index(){

        $env = new Env;

        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['user' => $env->getUserDir()]);
    }
}