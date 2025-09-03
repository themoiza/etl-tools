<?php

namespace App\Model\Tools;

class UploadZip{

    protected $_tempZipFile;

    public function sendChunk($log, $end = false){

        echo $log;
        ob_flush();
        usleep(5000);
    }

    public function load($conn){

        $this->sendChunk('Process started at '.date('Y-m-d H:i:s').'<n>');

        $zipPath = $_POST['zipPath'];

        if(!is_file($zipPath)){

            $this->sendChunk('File not found: '.$zipPath.'<n>');
            exit;
        }

        $mime = mime_content_type($zipPath);

        if($mime != 'application/zip'){

            $this->sendChunk('Invalid file type. Expected a zip file: '.$zipPath.'<n>');
            exit;
        }

        sleep(5);

        try {

            $this->sendChunk('Reading uploaded files: '.$zipPath.'<n>');

            $query = $conn->query('select concat(chave, sha1) as chave from arquivos.binarios');
            $fetch = $query->fetchAll(\PDO::FETCH_ASSOC);

            $existentes = [];
            foreach($fetch as $arr){
                $existentes[] = $arr['chave'];
            }

            $this->sendChunk(count($existentes).' files already exist in the server<n>');

            $zip = new \ZipArchive;
            $zip->open($zipPath);

            for ($i = 0; $i < $zip->numFiles; $i++){

                $fileInZip = $zip->statIndex($i);

                // Skip if it's a directory
                if (substr($fileInZip['name'], -1) === '/') {
                    continue;
                }

                $chave = $fileInZip['name'];
                $chave = mb_convert_encoding($chave, 'ISO-8859-1', 'UTF-8');

                // Get only the file name (after the last slash)
                $explode = explode('/', $chave);
                $chave = $explode[count($explode) - 1];

                $conteudoArquivo = $zip->getFromIndex($i);
                $sha1 = sha1($conteudoArquivo);

                // Check if already converted
                if(in_array($chave.$sha1, $existentes)){

                    // Skip already processed files
                    continue;
                }

                // Add to the existing list in memory
                $existentes[] = $chave.$sha1;

                $this->_tempZipFile = tmpfile();
                fwrite($this->_tempZipFile, $zip->getFromIndex($i));
                fseek($this->_tempZipFile, 0);

                $mime = mime_content_type(stream_get_meta_data($this->_tempZipFile)['uri']);
                $data = date('Y-m-d', $fileInZip['mtime']);

                $base64 = base64_encode($zip->getFromIndex($i));

                $this->sendChunk('Reading: '.str_repeat('0',  6 - strlen($i)).$i.' '.$fileInZip['name'].'<r>');

                $query = $conn->prepare('INSERT INTO arquivos.binarios (
                    chave, mime, "data", arquivo, sha1
                ) VALUES (
                    :chave,
                    :mime,
                    :data,
                    nullif(decode(:arquivo, \'base64\'), \'\'),
                    :sha1
                )');

                $query->bindParam(':chave', $chave);
                $query->bindParam(':mime', $mime);
                $query->bindParam(':data', $data);
                $query->bindParam(':arquivo', $base64);
                $query->bindParam(':sha1', $sha1);
                $query->execute();

            }

            // Clean memory
            $zip = null;

        } catch (UploadZipToDatabaseException $e){

            $this->sendChunk($e->getMessage());
        }

        $this->sendChunk('Process finished at '.date('Y-m-d H:i:s').'<n>');
    } 
}