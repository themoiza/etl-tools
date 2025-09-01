<?php

namespace App\Model;

use App\Model\RaPgsqlException;

use App\Model\Environment\Env;

class Project {

    public function getConnection(){

        $env = new Env;
        $dbConnection = $env->getDbConfig();

        try{

            $dsn = 'pgsql'.':host='.$dbConnection->host.';port='.$dbConnection->port.';dbname='.$dbConnection->dbname.';options=\'--client_encoding=UTF8\'';
            $pdo = new \PDO($dsn, $dbConnection->user, $dbConnection->password, []);
            $pdo->setAttribute(\PDO::ATTR_EMULATE_PREPARES, 1);

            return $pdo;

        }catch(\PDOException $e){

            header('Content-Type: application/json; charset=utf-8');
            echo json_encode(['result' => $e->getMessage()]);
        }
    }
}