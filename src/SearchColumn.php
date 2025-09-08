<?php

namespace App;

use App\Model\Project;
use App\Model\Postgres\Schemas;
use App\Model\Postgres\Search;

class SearchColumn{

    private $_conn;

    public function index(){

        ignore_user_abort(false);

        $project = new Project;
        $this->_conn = $project->getConnection();

        $schema = new Search;
        $result = $schema->columns($this->_conn);

        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($result);
    }

    public function getschemas(){

        ignore_user_abort(false);

        $project = new Project;
        $this->_conn = $project->getConnection();

        $schema = new Schemas;
        $result = $schema->get($this->_conn);

        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['schemas' => $result]);
    }
}