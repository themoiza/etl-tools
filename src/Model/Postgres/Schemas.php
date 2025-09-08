<?php

namespace App\Model\Postgres;

class Schemas {

    public function get($con){

        $query = $con->prepare("SELECT schema_name
            FROM information_schema.schemata
            WHERE schema_name NOT IN ('pg_catalog', 'information_schema')
            ORDER BY schema_name;");

        $query->execute();
        $fetch = $query->fetchAll(\PDO::FETCH_ASSOC);

        return array_column($fetch, 'schema_name');
    }
}