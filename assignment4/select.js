require('dotenv').config();
const { Client } = require('pg');
var async = require('async');

// AWS RDS POSTGRESQL INSTANCE
var db_credentials = new Object();
db_credentials.user = 'colmac';
db_credentials.host = process.env.AWSRDS_EP;
db_credentials.database = 'datastructuresdb';
db_credentials.password = process.env.AWS_PW;
db_credentials.port = 5432;

const client = new Client(db_credentials);
client.connect();
//var thisQuery = "DROP TABLE aalocations;"; 
// Sample SQL statement to create a table: 

//var thisQuery = "INSERT INTO aalocations VALUES (E'"value.id + ", " + value.address + ", " + value.add2 + ", " +  value.location + ", " + value.name + "', " + value.details + ", " + value.access + ");";
//make access a boolean
//var thisQuery = "CREATE TABLE aalocations (address varchar(200), add2 varchar(200), location varchar(200), name varchar(200), details varchar(200), access varchar(100) );";
// Sample SQL statement to delete a table: 
var thisQuery = "DROP TABLE aalocations;"; 
// Sample SQL statement to query the entire contents of a table: 
//var thisQuery = "SELECT * FROM aalocations;";

client.query(thisQuery, (err, res) => {
    console.log(err, res);
    client.end();
 }); 
