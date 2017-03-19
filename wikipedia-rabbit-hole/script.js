(function() {
  //set up space
  var searchForm = document.getElementById('wikipedia-form');
  searchForm.value = '';

  searchForm.addEventListener('submit', function(e) {
    e.preventDefault();
    var search = e.target[0].value.toLowerCase();

    if (search) {
      // remove symbols and numbers and get the first word in the string
      search = search.replace(/[^a-z ]/g, '');
      // if first word is valid then call api
      if (search) {
        document.getElementById('title').innerHTML = '';
        wikipedia(search);
      }
    }
  });
})();

function wikipedia (value){
  var fetch = function(url, cb) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          cb(null, JSON.parse(xhr.responseText));
        } else {
          cb(true);
        }
      }
    };
    xhr.open('GET', url, true);
    xhr.send();
  };

  // DOM HELPERS
  var newElement = function (tag, className, text) {
    var el = document.createElement(tag);
    el.className = className;
    if (text) { el.appendChild(document.createTextNode(text)); }
    return el;
  };
  var p = function (text) {
    return newElement('p', 'results__paragraph', text || '');
  }
  var a = function (url) {
    var link = newElement('a', 'results__link', '(link)');
    link.href = url;
    return link;
  }

  // FETCH API
  var url = 'https://en.wikipedia.org/w/api.php?'
            + 'action=opensearch&format=json&search='
            + value
            + '&namespace=0&origin=*&limit=5';

  fetch(url, function(err, wiki) {
    var res = document.getElementById('results');
    res.innerHTML = '';

    if(wiki[2][0]){
      wiki[2].forEach(function (item, index) {
        res.appendChild(split(item));

        if (!item.includes('may refer to') && item) {
          res.lastChild.appendChild(a(wiki[3][index]));
        }
      });
    } else {
      var para = p('Sorry, there were no matching results.');
      res.appendChild(para);
    }

    var spans = [].slice.call(document.getElementsByTagName('span'));

    spans.forEach(function (span) {
      span.addEventListener('click', addSpans);
    });
  });
}

function addSpans(){
  if(this.innerText.toLowerCase().replace(/[^a-z0-9]/g, '')){
      removeEvents([].slice.call(document.getElementsByTagName('span')));
      wikipedia(this.innerHTML.toLowerCase().replace(/[^a-z0-9]/g, ''));
    }
}

function removeEvents (arr) {
  arr.forEach(function (item) {
    item.removeEventListener('click', addSpans);
  });
}

function split (text) {
  var node = document.createElement('p');
  node.className = 'results__paragraph';

  text.split(" ")
    .forEach(word => {
      var s = document.createElement('span');
      s.innerText = word + ' ';
      node.appendChild(s);
    });

  return node;
}
