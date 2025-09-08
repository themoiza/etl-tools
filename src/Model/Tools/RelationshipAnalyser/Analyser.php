<?php

namespace App\Model\Tools\RelationshipAnalyser;

use \Redis;

class Analyser
{
    private $redis;

    public function __construct()
    {
        $this->connect();
    }

    private function connect()
    {
        $this->redis = new \Redis();

        // conexão persistente (não fecha entre requests)
        $this->redis->pconnect('127.0.0.1', 6379, 1.5);

        // opcional: se quiser ver quando a conexão cair
        $this->redis->setOption(Redis::OPT_READ_TIMEOUT, -1);
    }

    public function sendChunk($log, $end = false)
    {
        /*try {

            if (!$this->redis->isConnected()) {
                $this->connect();
            }

            $this->redis->publish('logs', $log);

        } catch (\RedisException $e) {*/

            $this->connect();
            $this->redis->publish('logs', $log);
        /*}*/

        echo $log;
        ob_flush();
        usleep(5000);
    }

    public function progressBarText($text, $progress) {

        $width = 100;
        $percent = intval($progress * 100);

        $barWidth = $width - strlen($text) - 8;
        if ($barWidth < 10) $barWidth = 10;

        $done = intval($barWidth * $progress);
        $todo = $barWidth - $done;

        if($todo < 1){
            $todo = 1;
        }

        $bar = str_repeat("=", $done) . str_repeat("-", $todo);

        return sprintf("[%s%s%3d%%]", $text, $bar, $percent);
    }

    public function run($conn, $schema, $table, $cols){

        $cols = '\''.implode('\',\'', $cols).'\'';

        $base = $conn->prepare("SELECT c.table_name, c.column_name, c.data_type
        FROM information_schema.columns c
        JOIN information_schema.tables t 
        ON c.table_schema = t.table_schema
        AND c.table_name   = t.table_name
        WHERE c.table_schema = :schema
        AND c.column_name <> '_pkey_'
        AND c.data_type IN (
                'bigint',
                'integer',
                'character varying',
                'text'
            )
        AND t.table_type = 'BASE TABLE'
        and t.table_name = '$table'
        and c.column_name in ($cols)
        ORDER BY c.table_schema DESC, c.table_name");

        $base->bindParam(':schema', $schema);
        $base->execute();
        $tabelasBases = $base->fetchAll(\PDO::FETCH_ASSOC);

        $stmt = $conn->prepare("SELECT c.table_name, c.column_name, c.data_type
        FROM information_schema.columns c
        JOIN information_schema.tables t 
        ON c.table_schema = t.table_schema
        AND c.table_name   = t.table_name
        WHERE c.table_schema = :schema
        AND c.column_name <> '_pkey_'
        AND c.data_type IN (
                'bigint',
                'integer',
                'character varying',
                'text'
            )
        AND t.table_type = 'BASE TABLE'
        ORDER BY c.table_schema DESC, c.table_name");

        $stmt->execute(['schema' => $schema]);
        $tabelas = $stmt->fetchAll(\PDO::FETCH_ASSOC);
        $totalColumns = count($tabelas);

        $tabelasBasesCols = [];
        $i = 0;
        foreach($tabelasBases as $k => $linha){

            if(!isset($tabelasBasesCols[$i][$linha['table_name']])){
                $i++;
            }
            $tabelasBasesCols[$i][$linha['table_name']][] = ['col' => $linha['column_name'], 'data_type' => $linha['data_type']];
        }

        $tabelasCols = [];
        $i = 0;
        foreach($tabelas as $k => $linha){

            if(!isset($tabelasCols[$i][$linha['table_name']])){
                $i++;
            }
            $tabelasCols[$i][$linha['table_name']][] = ['col' => $linha['column_name'], 'data_type' => $linha['data_type']];
        }

        // Montar pares de colunas diferentes
        $relations = [];
        $sql = [];

        $barIncrement = 0;
        foreach ($tabelasBasesCols as $tabela) {

            foreach($tabela[key($tabela)] as $col){
                
                $a = ['table_name' => key($tabela), 'column_name' => $col['col'], 'data_type' => $col['data_type']];

                foreach ($tabelasCols as $tabelaB) {
            
                    foreach($tabelaB[key($tabelaB)] as $colB){
                        
                        $barIncrement++;

                        $b = ['table_name' => key($tabelaB), 'column_name' => $colB['col'], 'data_type' => $colB['data_type']];

                        $textBar = implode('.', $a).' vs '.implode('.', $b);
                        $this->sendChunk($this->progressBarText($textBar, $barIncrement/$totalColumns).'<r>');

                        if($a['data_type'] == $b['data_type'] and ($a['table_name'].$a['column_name']) != ($b['table_name'].$b['column_name'])){

                            $sql[] = "
select
    '{$a['table_name']}' AS table1,
    '{$a['column_name']}' AS col1,
    '{$b['table_name']}' AS table2,
    '{$b['column_name']}' AS col2,
    (select count(*) from {$schema}.\"{$a['table_name']}\") = (SELECT COUNT(*) FROM (SELECT DISTINCT \"{$a['column_name']}\" FROM {$schema}.\"{$a['table_name']}\") x) AS unique_a,
    (select count(*) from {$schema}.\"{$b['table_name']}\") = (SELECT COUNT(*) FROM (SELECT DISTINCT \"{$b['column_name']}\" FROM {$schema}.\"{$b['table_name']}\") x) AS unique_b,
    (select count(*) from {$schema}.\"{$a['table_name']}\" t1 where t1.\"{$a['column_name']}\" <> '' and t1.\"{$a['column_name']}\" in (select distinct \"{$b['column_name']}\" from {$schema}.\"{$b['table_name']}\" where \"{$b['column_name']}\" <> '')) AS matches,
    (select count(*) from {$schema}.\"{$a['table_name']}\" t1 where t1.\"{$a['column_name']}\" <> '' and t1.\"{$a['column_name']}\" not in (select distinct \"{$b['column_name']}\" from {$schema}.\"{$b['table_name']}\" where \"{$b['column_name']}\" <> '')) AS mismatches";
                            
                        }

                        if(count($sql) >= 1){

                            try {

                                $query = $conn->prepare(implode(' UNION ', $sql));
                                $query->execute();

                            } catch (\PDOException $e) {
                                $this->sendChunk($e->getMessage());
                            }

                            $results = $query->fetchAll(\PDO::FETCH_ASSOC);

                            foreach ($results as $result) {
                                if ($result['matches'] > 0 && $result['mismatches'] == 0 && ($result['table1'].$result['col1']) != ($result['table2'].$result['col2'])) {

                                    if($result['unique_a'] !== $result['unique_b']){

                                        $direction = '=>';
                                        if($result['unique_a'] === true and $result['unique_b'] === false){
                                            $direction = '<=';
                                        }

                                        $relations[] = [
                                            'table1'    => $result['table1'],
                                            'col1'      => $result['col1'],
                                            'table2'    => $result['table2'],
                                            'col2'      => $result['col2'],
                                            'unique_a'  => $result['unique_a'],
                                            'unique_b'  => $result['unique_b'],
                                            'direction' => $direction,
                                            'matches'   => $result['matches']
                                        ];
                                    }
                                }
                            }

                            $sql = [];
                        }
                    }
                }

                // Exibir resultado
                if (!empty($relations)) {

                    $this->sendChunk('Relações encontradas:<n>');
                    foreach ($relations as $rel) {

                        $this->sendChunk("{$rel['table1']}.{$rel['col1']} {$rel['direction']} {$rel['table2']}.{$rel['col2']}<n>");

                        $uIndex = '';
                        $fKey = '';

                        if($rel['direction'] == '=>'){

                            $uIndex = "CREATE UNIQUE INDEX \"{$rel['table2']}_{$rel['col2']}_idx\" ON {$schema}.\"{$rel['table2']}\" ({$rel['col2']})";
                            $fKey = "ALTER TABLE {$schema}.\"{$rel['table1']}\" ADD CONSTRAINT \"{$rel['table1']}_{$rel['table2']}_fk\" FOREIGN KEY ({$rel['col1']}) REFERENCES {$schema}.\"{$rel['table2']}\"({$rel['col2']})";
                        }
                        if($rel['direction'] == '<='){

                            $uIndex = "CREATE UNIQUE INDEX \"{$rel['table1']}_{$rel['col1']}_idx\" ON {$schema}.\"{$rel['table1']}\" ({$rel['col1']})";
                            $fKey = "ALTER TABLE {$schema}.\"{$rel['table2']}\" ADD CONSTRAINT \"{$rel['table2']}_{$rel['table1']}_fk\" FOREIGN KEY ({$rel['col2']}) REFERENCES {$schema}.\"{$rel['table1']}\"({$rel['col1']})";
                        }

                        try {

                            $query = $conn->prepare($uIndex);
                            $query->execute();

                            $this->sendChunk("CREATE UNIQUE INDEX \"{$rel['table2']}_{$rel['col2']}_idx<n>");

                        } catch (\PDOException $e) {

                            $this->sendChunk($e->getMessage());
                        }

                        try {

                            $query = $conn->prepare($fKey);
                            $query->execute();

                            $this->sendChunk("FOREIGN KEY ({$rel['col2']})");

                        } catch (\PDOException $e) {

                            $this->sendChunk($e->getMessage());
                        }
                    }

                    $relations = [];
                }
            }

            if(count($sql) > 0){

                $query = $conn->prepare(implode(' UNION ', $sql));
                $query->execute();
                $results = $query->fetchAll(\PDO::FETCH_ASSOC);

                foreach ($results as $result) {

                    if ($result['matches'] > 0 && $result['mismatches'] == 0 && ($result['table1'].$result['col1']) != ($result['table2'].$result['col2'])) {

                        if($result['unique_a'] !== $result['unique_b']){

                            $direction = '=>';
                            if($result['unique_a'] === true and $result['unique_b'] === false){
                                $direction = '<=';
                            }

                            $relations[] = [
                                'table1'    => $result['table1'],
                                'col1'      => $result['col1'],
                                'table2'    => $result['table2'],
                                'col2'      => $result['col2'],
                                'unique_a'  => $result['unique_a'],
                                'unique_b'  => $result['unique_b'],
                                'direction' => $direction,
                                'matches'   => $result['matches']
                            ];
                        }
                    }
                }

                $sql = [];
            }
        }

        // Exibir resultado
        if (!empty($relations)) {

            $this->sendChunk("Relações encontradas:<n>");
            foreach ($relations as $rel) {

                $this->sendChunk("{$rel['table1']}.{$rel['col1']} {$rel['direction']} {$rel['table2']}.{$rel['col2']}<n>");

                $uIndex = '';
                $fKey = '';

                if($rel['direction'] == '=>'){

                    $uIndex = "CREATE UNIQUE INDEX \"{$rel['table2']}_{$rel['col2']}_idx\" ON {$schema}.\"{$rel['table2']}\" ({$rel['col2']})";
                    $fKey = "ALTER TABLE {$schema}.\"{$rel['table1']}\" ADD CONSTRAINT \"{$rel['table1']}_{$rel['table2']}_fk\" FOREIGN KEY ({$rel['col1']}) REFERENCES {$schema}.\"{$rel['table2']}\"({$rel['col2']})";
                }
                if($rel['direction'] == '<='){

                    $uIndex = "CREATE UNIQUE INDEX \"{$rel['table1']}_{$rel['col1']}_idx\" ON {$schema}.\"{$rel['table1']}\" ({$rel['col1']})";
                    $fKey = "ALTER TABLE {$schema}.\"{$rel['table2']}\" ADD CONSTRAINT \"{$rel['table2']}_{$rel['table1']}_fk\" FOREIGN KEY ({$rel['col2']}) REFERENCES {$schema}.\"{$rel['table1']}\"({$rel['col1']})";
                }

                try {

                    $query = $conn->prepare($uIndex);
                    $query->execute();

                    $this->sendChunk("CREATE UNIQUE INDEX \"{$rel['table2']}_{$rel['col2']}_idx<n>");

                } catch (\PDOException $e) {
                    $this->sendChunk($e->getMessage());
                }

                try {

                    $query = $conn->prepare($fKey);
                    $query->execute();

                    $this->sendChunk("FOREIGN KEY ({$rel['col2']})<n>");

                } catch (\PDOException $e) {
                    $this->sendChunk($e->getMessage());
                }
            }
        }

        // Exibir resultado
        if (!empty($relations)) {

            $this->sendChunk("Relações encontradas:<n>", true);
            foreach ($relations as $rel) {

                $this->sendChunk("{$rel['table1']}.{$rel['col1']} {$rel['direction']} {$rel['table2']}.{$rel['col2']}<n>");

            }
        } else {
            $this->sendChunk("Nenhuma relação encontrada.<n>", true);
        }
    }
}