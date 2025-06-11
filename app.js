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

const port = 5000;
const domain = 'http://localhost:';

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extend: true}));
app.use(express.static(__dirname + '/public'));

app.listen(port, function () {
  console.log('Server is running on', domain, port);
});

app.get('/', function(req, res){
  var q = 'SELECT COUNT(*) AS count FROM email';
  connection.query(q, function(error, results, fields)
    {if (error) throw error;
      // console.log(results[0].count);
      var nou = results[0].count;
      res.render('home', {nou:nou});
    }
  );
});

// app.get('/list', function(req, res){
//   var q = 'SELECT email AS list FROM email';
//   connection.query(q, function(error, results, fields)
//     {if (error) throw error;
//       var list = results.list;
//       res.render('list', {list:list});
//     }
//   );
// })

app.get('/list', function(req, res) {
  var page = parseInt(req.query.page) || 1;
  var limit = 20;
  var offset = (page - 1) * limit;

  var q = 'SELECT COUNT(*) AS count FROM email';
  var w = 'SELECT id, email FROM email LIMIT ? OFFSET ?';
  // var w = 'SELECT id, email FROM email';

  connection.query(q, function(error, countResult) {
    if (error) throw error;
    var totalEmails = countResult[0].count;
    var totalPages = Math.ceil(totalEmails / limit);

    connection.query(w, [limit, offset], function(error, results) {
      if (error) throw error;
      res.render('list', {
        list: results,
        currentPage: page,
        totalPages: totalPages
      });
    });
  });
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