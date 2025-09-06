<?php

namespace App\Model\Tools;

class ViewBytea{

    public function load($conn, $sql){

        $sql = 'select * from ('.$sql.') x limit 1';

        $query = $conn->prepare($sql);
        $query->execute();

        $fetch = $query->fetch(\PDO::FETCH_ASSOC);
    }
}