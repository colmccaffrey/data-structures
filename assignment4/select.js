require('dotenv').config();
const { Client } = require('pg');
var async = require('async');

// AWS RDS POSTGRESQL INSTANCE
var db_credentials = new Object();
db_credentials.user = 'adminc';
db_credentials.host = 'colmacdb.cad780eu8lhp.us-east-1.rds.amazonaws.com';
db_credentials.database = 'aa_newdb';
db_credentials.password = process.env.AWS_PW;
db_credentials.port = 5432;

const client = new Client(db_credentials);
client.connect();
//var thisQuery = "DROP TABLE aalocations;"; 

var thisQuery = "SELECT * FROM aalocations;";
client.query(thisQuery, (err, res) => {
    console.log(err, res);
    client.end();
 }); 
