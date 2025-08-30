<?php

namespace App\Model\Environment;

class Env {

    public function getUserDir(){

        // Linux and macOS
        $userDir = getenv('HOME'); 
        if ($userDir === false) {

            // Windows
            $userDir = getenv('USERPROFILE'); 
        }

        return $userDir;
    }

    public function getDbConfig(){

        return json_decode(file_get_contents($this->getUserDir().'/etl-tools/config.json'));

    }
}