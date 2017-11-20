<?php
  class RestServer {
    private $serviceName;
    private $classMethod;
    private $requestParam;
    public $message;

    function __construct() {
      $this->message = new RestMessage();
    }

    function loadService($serviceName) {
      if (class_exists($serviceName)) {
        $this->serviceName = new $serviceName();
      } else {
        $this->showErrorServer('Server Error, serviceName not found.', 404);
      }

      $D = array();
      switch ($this->message->request->httpMethod) {
        case 'GET'    :
        case 'DELETE' : $D = $_GET; break;
        case 'POST'   : $D = $_POST; break;
        case 'PUT'    : parse_str(file_get_contents('php://input'), $D); break;
        default       : $this->showErrorServer('Server Error, HTTP method not found.', 404);
      }

      if (isset($D['method'])) {
        $this->setClassMethod($D['method']);
        unset($D['method']);
        $this->requestParam= $D;
      } else {
        $this->showErrorServer('Server Error, param method not found.', 400);
      }
      if (!isset($this->message->response->serverError)) {
        $this->message->response->body = call_user_func(array($this->serviceName, $this->classMethod), $this->requestParam);
      }
    }

    private function showErrorServer($message, $codeHTTP) {
      $this->message->response->serverError        = $codeHTTP;
      $this->message->response->serverErrorMessage = $message;
    }

    private function setClassMethod($methodName) {
      $this->classMethod= strtolower($this->message->request->httpMethod.'_'.$methodName);
      if (!method_exists($this->serviceName, $this->classMethod)) {
        $this->showErrorServer('Server Error, invalid method.', 405);
      }
    }

    public function __destruct() {
      $this->message->send();
    }
  }

  class RestMessage {
    public $request, $response;

    function __construct() {
        $this->request  = new stdClass();
        $this->response = new stdClass();
        $this->request->httpMethod = strtoupper($_SERVER['REQUEST_METHOD']);
    }

    function send() {
      if (isset($this->response->serverError)) {
        http_response_code($this->response->serverError);
      }
      echo json_encode($this->response, JSON_PRETTY_PRINT | JSON_NUMERIC_CHECK);
    }
  }
?>
