<?php

namespace App\Controllers;

use App\Model\Project;

use App\Model\Tools\ViewBytea;

class ViewByteaController{

    private $_conn;

    public function index(){

        $project = new Project;
        $this->_conn = $project->getConnection();

        $sql = $_POST['sql'];

        $upload = new ViewBytea;
        $file = $upload->load($this->_conn, $sql);

        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($file);
    }
}