var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '159624',
  database : 'opentutorials'
});
 
connection.connect();
 
connection.query('SELECT * FROM topic', (error, results, fields) => {
  if (error) {
      console.log(error);
  }
  console.log(results);
});
 
connection.end();