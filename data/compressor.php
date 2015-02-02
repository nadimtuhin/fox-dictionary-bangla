<?php

$json = file_get_contents('db.json');

$json = json_decode($json);
$json = json_encode($json, JSON_UNESCAPED_UNICODE);

file_put_contents('../www/data/db.compressed.json', $json);
