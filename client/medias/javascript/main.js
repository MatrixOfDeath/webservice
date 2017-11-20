const SERVER_URL = 'http://localhost/webservice/server/';

$ = document;
tbody = $.getElementsByClassName('table')[0].getElementsByTagName('tbody')[0];

function initialize() {
  row = tbody.insertRow(0);
  cellContent = row.insertCell(0);
  cellAction = row.insertCell(1);
  textToInput(cellContent, cellAction);
  _get(SERVER_URL+'?method=data');
  $.getElementById('add').onclick = function() { appendContent('coucou') };
}

function appendContent(content) {
  row = tbody.insertRow(0);
  cellContent = row.insertCell(0);
  cellAction = row.insertCell(1);
  cellContent.innerHTML = content;
  cellAction.innerHTML = "<a class='waves-effect waves-light btn red'>Delete</a>";
  cellAction.onclick = function() { this.parentNode.remove(); };
  cellContent.ondblclick = function() { textToInput(this, this.parentNode.childNodes[1]) };
}

function textToInput(cellContent, cellAction) {
  input = document.createElement('input');
  input.id = 'current_put';
  input.type = 'text';
  input.value = cellContent.innerHTML;
  cellContent.innerHTML = '';
  cellContent.appendChild(input);
  cellAction.innerHTML = "<a class='waves-effect waves-light btn green'>Valider</a>";
  cellAction.onclick = function() {
    _post(SERVER_URL, input.value);
    inputToText(this.parentNode.childNodes[0], this);
  };
  cellContent.onkeypress = function(e) {
    if (e.keyCode == 13) {
      _post(SERVER_URL, input.value);
      inputToText(this, this.parentNode.childNodes[1]);
    }
  };
}

function inputToText(cellContent, cellAction) {
  var input = $.getElementById('current_put');
  var text = input.value;
  cellContent.removeChild(input);
  cellContent.innerHTML = text;
  cellContent.ondblclick = function() { textToInput(this, this.parentNode.childNodes[1]) };
  cellAction.innerHTML = "<a class='waves-effect waves-light btn red'>Delete</a>";
  cellAction.onclick = function() { this.parentNode.remove(); };
}

function _get(url) {
  var req = new XMLHttpRequest();
  req.open('GET', url);

  req.onreadystatechange = function() {
    if (req.readyState == 4 && (req.status == 200 || req.status == 0)) {
      json_datas = JSON.parse(req.responseText);
      appendContent(json_datas.body);
    }
  }

  req.send();
}

function _post(url, content) {
  var req = new XMLHttpRequest();
  req.open('POST', url);

  req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  req.onreadystatechange = function() {
    if (req.readyState == 4 && (req.status == 200 || req.status == 0)) {
      json_datas = JSON.parse(req.responseText);
    }
  }

  req.send('method=data&content='+content);
}

initialize();
