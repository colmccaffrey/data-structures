require('dotenv').config();
var express = require('express'), // npm install express
    app = express();
const { Pool } = require('pg');
var AWS = require('aws-sdk');

// AWS RDS credentials
var db_credentials = new Object();
db_credentials.user = 'colmac';
db_credentials.host = process.env.AWSRDS_EP;
db_credentials.database = 'datastructuresdb';
db_credentials.password = process.env.AWS_PW;
db_credentials.port = 5432;

// AWS DynamoDB credentials
AWS.config = new AWS.Config();
AWS.config.accessKeyId = process.env.AWS_ID;
AWS.config.secretAccessKey = process.env.AWS_KEY;
AWS.config.region = "us-east-1";

// respond to requests for /sensor
app.get('/sensor', function(req, res) {
    
    // Connect to the AWS RDS Postgres database
    const client = new Pool(db_credentials);

    // SQL query 
    var q = `SELECT EXTRACT(DAY FROM sensorTime) as sensorday,
             AVG(sensorValue::int) as num_obs
             FROM sensorData
             GROUP BY sensorday
             ORDER BY sensorday;`;
    

    //client.connect();
    client.query(q, (qerr, qres) => {
        if (qerr) { throw qerr }
        else {
            res.send(qres.rows);
            client.end();
            console.log('1) responded to request for sensor data');
        }
    });
});


// respond to requests for /aameetings
app.get('/aameetings', function(req, res) {
    
    // Connect to the AWS RDS Postgres database
    const client = new Pool(db_credentials);
    
    // SQL query
    
    var thisQuery = `SELECT * FROM aalocations;`;
    //var thisQuery = "SELECT mtgday, mtgtime, mtglocation, mtgaddress, mtgtypes FROM aadata WHERE mtgday = 'Monday' and mtghour >= 7;";

                 
   

    client.query(thisQuery, (qerr, qres) => {
        if (qerr) { throw qerr }
        else {
            res.send(qres.rows);
            client.end();
            console.log('2) responded to request for aa meeting data');
        }
    });
});

// respond to requests for /deardiary
app.get('/deardiary', function(req, res) {

    // Connect to the AWS DynamoDB database
    var dynamodb = new AWS.DynamoDB();
    AWS.config.accessKeyId = process.env.AWS_ID;
    AWS.config.secretAccessKey = process.env.AWS_KEY;
    AWS.config.region = "us-east-1";
    
    // DynamoDB (NoSQL) query
    var params = {
        TableName: "deardiary",
        KeyConditionExpression: "#dt = :entryDate", // the query expression
        ExpressionAttributeNames: { // name substitution, used for reserved words in DynamoDB
            "#dt": "pk"
        },
        ExpressionAttributeValues: { // the query values
            ":entryDate": {S: "Thu Oct 11 2018"}
        }
    };

    
    dynamodb.query(params, function(err, data) {
        if (err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
        }
        else {
            res.send(data.Items);
            console.log('3) responded to request for dear diary data');
        }
    });

});

// serve static files in /public
app.use(express.static('public'));

// listen on port 8080
app.listen(8080, function() {
    console.log('Server listening...');
});