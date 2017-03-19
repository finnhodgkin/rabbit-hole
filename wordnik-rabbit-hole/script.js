(function() {
  //set up space
  var searchForm = document.getElementById('definition-form');
  searchForm.value = '';

  document.getElementById('new').addEventListener('click', function() {
    search();
    results();
    document.getElementById('word').focus();
  });

  //on enter display results
  searchForm.addEventListener('submit', function(e) {
    e.preventDefault();
    var word = e.target[0].value.toLowerCase();
    if (word) {
      // remove symbols and numbers and get the first word in the string
      word = word.split(' ')[0].replace(/[^a-z]/g, '');
      // if first word is valid then call api
      if(word) {
        wordnik(word);
      }
    }
  });
})();

function wordnik (wordN) {
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

  var newElement = function (tag, className, text) {
    var el = document.createElement(tag);
    el.className = className;

    if (text) {
      el.appendChild(document.createTextNode(text));
    }

    return el;
  };

  var italicB = function (text) {
    return newElement('p', 'results__word-type', text);
  };

  var h2 = function (text) {
    return newElement('h2', 'results__title', text);
  };

  var buildWords = function (err, definition) {
    if (err) {
      console.log(err);
      return;
    }

    var res = document.getElementById('results');
    res.innerHTML = '';

    if (definition[0]) {

      // display results
      results(true);

      res.appendChild(h2(definition[0].word));
      res.appendChild(italicB(definition[0].partOfSpeech));
      res.appendChild(split(definition[0].text));

      // split results into clickable spans
      var words = [].slice.call(document.getElementsByTagName('span'));

      words.forEach(function (element, index) {
        element.addEventListener('click', addSpans)
      });

      //hide search
      search(true)
    } else {
      //display error message in "results"
      document.getElementById('results').innerHTML = "Sorry, couldn't find a definition for \"" + wordN + "\". Try again.";
      results(true);
      search();
    }
  };

  fetch('http://api.wordnik.com:80/v4/word.json/' + wordN + '/definitions?limit=1&includeRelated=false&sourceDictionaries=wiktionary&useCanonical=true&includeTags=false&api_key=' +
  _WORDNIK_API_KEY, buildWords);

}

function search(hide){
  var searchForm = document.getElementById("word")
  if (!hide) {
    searchForm.className = '';
    searchForm.value = '';
  } else {
    searchForm.className = 'hide'
  }
}

function results(hide){
  var res = document.getElementById("results");
  var newWord = document.getElementById('new');
  if(!hide) {
    res.className = '';
    newWord.className = '';
  } else {
    res.className = 'on';
    newWord.className = 'on';
  }
}

function addSpans(){
  if(this.innerText.toLowerCase().replace(/[^a-z0-9]/g, '')){
    removeEvents([].slice.call(document.getElementsByTagName('span')));
    wordnik(this.innerHTML.toLowerCase().replace(/[^a-z0-9]/g, ''));
  }
}

function removeEvents (arr) {
  arr.forEach(function (item) {
    item.removeEventListener('click', addSpans);
  });
}

function split (text) {
  var node = document.createElement('p');
  node.className = 'results__definition';

  text.split(" ")
    .forEach(word => {
      var s = document.createElement('span');
      s.innerText = word + ' ';
      node.appendChild(s);
    });

  return node;
}
