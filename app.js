var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mysql = require('mysql2');
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'rootpassword',
  database: 'node'
});

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
      var nou = results[0].count;
      res.render('home', {nou:nou});
    }
  );
});

app.get('/list', function(req, res) {
  var page = parseInt(req.query.page) || 1;
  var limit = 20;
  var offset = (page - 1) * limit;
  var search = req.query.search || '';

  let countQuery, dataQuery, queryParams;

  if (search) {
    q = 'SELECT COUNT(*) AS count FROM email WHERE email LIKE ?';
    w = 'SELECT id, email FROM email WHERE email LIKE ? LIMIT ? OFFSET ?';
    r = [`%${search}%`, limit, offset];
  } else {
    q = 'SELECT COUNT(*) AS count FROM email';
    w = 'SELECT id, email FROM email LIMIT ? OFFSET ?';
    r = [limit, offset];
  }

  connection.query(q, search ? [`%${search}%`] : [], function(error, countResult) {
  if (error) throw error;
  const totalEmails = countResult[0].count;
  const totalPages = Math.ceil(totalEmails / limit);
    connection.query(w, r, function(error, results) {
      if (error) throw error;
      res.render('list', {
        list: results,
        currentPage: page,
        totalPages: totalPages,
        search: search
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