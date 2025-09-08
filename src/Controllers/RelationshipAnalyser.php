<?php

namespace App\Controllers;

use App\Model\Project;

use App\Model\Tools\RelationshipAnalyser\Analyser;

class RelationshipAnalyser{

    private $_conn;

    public function index(){

        ignore_user_abort(false);

        $project = new Project;
        $this->_conn = $project->getConnection();

        $ra_schema = $_POST['ra_schema'];
        $ra_table = $_POST['ra_table'];
        $ra_columns = $_POST['ra_columns'];

        $ra_columns = explode(',', $ra_columns);

        $analyser = new Analyser;
        $analyser->run($this->_conn, $ra_schema, $ra_table, $ra_columns);
    }
}