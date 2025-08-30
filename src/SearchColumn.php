<?php

namespace App;

class SearchColumn{

    public function search(){

        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($_POST);
    }
}