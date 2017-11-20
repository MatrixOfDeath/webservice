<?php
  require_once 'core/rest_server.php';
  require_once 'service/data.php';

  session_start();

  $server = new RestServer();
  $server->loadService('data');


?>
