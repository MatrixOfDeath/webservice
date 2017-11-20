<?php
  class Data {
    function get_data() {
      return $_SESSION['content'];
    }
    function post_data($param) {
      $_SESSION['content'] = $param['content'];
      return $_SESSION['content'];
    }
    function put_data() {}
    function delete_data() {}
  }
?>
