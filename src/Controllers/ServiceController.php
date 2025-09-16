<?php

namespace App\Controllers;

class ServiceController{

    private $_conn;

    public function getFreePort(){

        ignore_user_abort(false);

        $command = 'lsof -i -nP | grep php 2>&1';
        $output = shell_exec($command);
        $lines = explode(PHP_EOL, $output);

        $inUse = [];
        foreach($lines as $line){

            if (preg_match('/:([0-9]+)->.*\(ESTABLISHED\)/', $line, $matches)) {
                if(isset($matches[1])){
                    $port = intval($matches[1]);
                    $inUse[$port] = $port;
                }
            }
        }

        $ports = [];
        foreach($lines as $line){

            if (preg_match('/:([0-9]+) \(LISTEN\)/', $line, $matches)) {
                if(isset($matches[1])){

                    $port = intval($matches[1]);
                    $ports[$port] = $port;
                }
            }
        }

        foreach($ports as $port){

            if(isset($inUse[$port])){
                unset($ports[$port]);
            }
        }

        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['ports' => array_values($ports)]);
    }
}