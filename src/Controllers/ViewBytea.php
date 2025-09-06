<?php

namespace App\Controllers;

use App\Model\Project;

use App\Model\Tools\ViewBytea;

class ViewByteaController{

    private $_conn;

    public function index(){

        $project = new Project;
        $this->_conn = $project->getConnection();

        $query = $_POST['query'];

        $upload = new ViewBytea;
        $upload->load($this->_conn, $query);
    }
}