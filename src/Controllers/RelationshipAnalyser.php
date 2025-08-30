<?php

namespace App\Controllers;

use App\Model\Project;

class RelationshipAnalyser{

    private $_conn;

    public function index(){

        $project = new Project;
        $this->_conn = $project->getConnection();

        header('Content-Type: application/json; charset=utf-8');

        try {

            $query = $this->_conn->prepare('select * from delta_protocolo.vw_ruas limit 1');
            $query->execute();
            $fetch = $query->fetch(\PDO::FETCH_ASSOC);

            echo json_encode(['result' => [$fetch]]);

        } catch (\PDOException $e) {

            echo json_encode(['result' => $e->getMessage()]);
        }
    }
}