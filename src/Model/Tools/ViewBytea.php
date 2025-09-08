<?php

namespace App\Model\Tools;

class ViewBytea{

    public $mimeTypes = [
        'application/msword' => 'doc',
        'application/octet-stream' => 'bin',
        'application/pdf' => 'pdf',
        'application/vnd.ms-excel' => 'xls',
        'application/vnd.oasis.opendocument.text' => 'odt',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation' => 'pptx',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' => 'xlsx',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document' => 'docx',
        'application/x-empty' => 'txt',
        'application/x-ole-storage' => 'ole',
        'application/x-rar' => 'rar',
        'application/zip' => 'zip',
        'audio/ogg' => 'ogg',
        'image/bmp' => 'bmp',
        'image/heic' => 'heic',
        'image/jpeg' => 'jpg',
        'image/png' => 'png',
        'image/tiff' => 'tiff',
        'image/vnd.dwg' => 'dwg',
        'text/html' => 'html',
        'text/plain' => 'txt',
        'text/rtf' => 'rtf',
        'video/3gpp' => '3gp',
        'video/mp4' => 'mp4'
    ];

    protected function clearTmpDir($dir = 'tmp') {

        if (!is_dir($dir)) {
            return;
        }

        $files = new \RecursiveIteratorIterator(
            new \RecursiveDirectoryIterator($dir, \RecursiveDirectoryIterator::SKIP_DOTS),
            \RecursiveIteratorIterator::CHILD_FIRST
        );

        foreach ($files as $file) {

            if(is_file($file->getRealPath())){
                unlink($file->getRealPath());
            }
        }
    }

    public function load($conn, $sql){

        $this->clearTmpDir('tmp');

        if(!is_dir('tmp')){
            mkdir('tmp');
        }

        $trimmed = rtrim($sql, " \t\n\r\0\x0B;");

        if (!preg_match('/\s+LIMIT\s+\d+$/i', $trimmed)) {
            $sql .= ' LIMIT 1';
        }

        $query = $conn->prepare($sql);
        $query->execute();

        $fetch = $query->fetch(\PDO::FETCH_ASSOC);

        $byteaIs = '';
        $colCount = $query->columnCount();
        for ($i = 0; $i < $colCount; $i++) {
            $meta = $query->getColumnMeta($i);

            if($meta['native_type'] == 'bytea'){
                $byteaIs = $meta['name'];
                break;
            }
        }

        $fileName = time();
        $mime = '';
        $ext = '';
        if ($byteaIs <> '' and is_resource($fetch['arquivo'])) {

            file_put_contents('tmp/'.$fileName, stream_get_contents($fetch['arquivo']));

            $mime = mime_content_type('tmp/'.$fileName);
            $ext = $this->mimeTypes[$mime] ?? '';
            rename('tmp/'.$fileName, 'tmp/'.$fileName.'.'.$ext);
            $fileName = $fileName.'.'.$ext;
        }

        return [
            'fileName' => 'tmp/'.$fileName,
            'mime' => $mime,
            'ext' => $ext
        ];
    }
}