var express = require('express');
var app = express();

var mysql = require('mysql2');
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'rootpassword',
  database: 'node'
});

const port = process.env.PORT || 5000;

app.listen(port, function () {
  console.log("Server Has Started!");
});

// app.get("/", function(req, res){
//     res.send("HELLO FROM OUR WEB APP!");
// });

app.get("/", function(req, res){
    var q = 'SELECT COUNT(*) AS count FROM email';
    connection.query(q, function(error, results, fields)
    {if (error) throw error;
        console.log(results[0].count);
        var nou = results[0].count;
        res.send("We have " + nou + " users");
    });
});
