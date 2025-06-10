var express = require('express');
var app = express();

var mysql = require('mysql2');
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'rootpassword',
  database: 'node'
});

var bodyParser = require('body-parser');

const port = process.env.PORT || 5000;

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extend: true}));

app.use(express.static(__dirname +'/styles'))

app.listen(port, function () {
  console.log('Server Has Started!');
});

app.get('/', function(req, res){
  var q = 'SELECT COUNT(*) AS count FROM email';
  connection.query(q, function(error, results, fields)
    {if (error) throw error;
      console.log(results[0].count);
      var nou = results[0].count;
      res.render('home', {nou:nou});
    }
  );
});

app.post('/register', function(req, res){
  var q = ('INSERT INTO email SET ?');
  var person = {email: req.body.email};
  connection.query(q, person, function(error, results)
    {if (error) throw error;
      console.log(results);
      res.redirect('/');
    }
  );
});
