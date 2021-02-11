var fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser')

var app = express();
var server = app.listen(3000, listening);


var data = fs.readFileSync('score.json');
var words = JSON.parse(data);

//sapp.use(express.static('website'));
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json());

console.log(words);

function listening(){
  console.log('listening');
}

app.get('/add/:word/:score', addWord);

function addWord(req, res){
  var data = req.params;
  var word = data.word;
  var score = data.score;

  words[word] = score;
}

app.post('/post', postThis);

function postThis(req, res) {
  console.log(req.body);
  console.log("postThis");
}

/*
var stig = {
    data : {
      name: this.name,
      score: this.score
    }
}


var input = JSON.stringify(stig);

fs.writeFile('score.json', input, function(err){
      if(err){
        return console.log(err);
      }
    });
*/
