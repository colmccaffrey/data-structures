require('dotenv').config();
const { Client } = require('pg');

// AWS RDS POSTGRESQL INSTANCE
var db_credentials = new Object();
db_credentials.user = 'colmac';
db_credentials.host = process.env.AWSRDS_EP;
db_credentials.database = 'datastructuresdb';
db_credentials.password = process.env.AWS_PW;
db_credentials.port = 5432;


// Connect to the AWS RDS Postgres database
const client = new Client(db_credentials);
client.connect();

// Sample SQL statement to create a table: 
var thisQuery = "CREATE TABLE sensorData ( sensorValue integer, sensorTime timestamp DEFAULT current_timestamp );";
//var thisQuery = "DROP TABLE sensorData;"
client.query(thisQuery, (err, res) => {
    console.log(err, res);
    client.end();
});