<?php

namespace App\Controllers;

use App\Model\Project;

use App\Model\Tools\UploadZip;

class UploadZipController{

    private $_conn;

    public function index(){

        ignore_user_abort(false);

        $project = new Project;
        $this->_conn = $project->getConnection();

        $upload = new UploadZip;
        $upload->load($this->_conn);
    }
}