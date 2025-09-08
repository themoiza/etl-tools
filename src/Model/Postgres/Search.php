<?php

namespace App\Model\Postgres;

class Search {

    public function columns($con){

        $schemas = $_POST['schemas'] ?? 'public';
        $column = $_POST['column'] ?? '';

        $query = $con->prepare(
            "SELECT
                table_schema,
                table_name,
                column_name,
                data_type
            FROM information_schema.columns
            WHERE column_name ilike :column
            AND table_schema = :schema");

        $query->bindParam(':column', $column);
        $query->bindParam(':schema', $schemas);
        $query->execute();

        $fetch = $query->fetchAll(\PDO::FETCH_ASSOC);

        return $fetch;
    }
}