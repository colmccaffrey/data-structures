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
    var d = new Date();
    var today = parseInt(d.getDate());

    // SQL query 
    var q = `SELECT EXTRACT(DAY FROM sensorTime) as sensorday,
             COUNT(sensorValue::int) as ounces
             FROM sensorData
             WHERE sensorValue >= 4
             GROUP BY sensorday
             ORDER BY sensorday;`;
    

    //client.connect();
    client.query(q, (qerr, qres) => {
        if (qerr) { throw qerr }
        else {
            res.send(qres.rows);
            client.end();
            console.log('1) responded to request for sensor data');
            console.log(d.getDate());

        }
    });
});


// respond to requests for /aameetings
app.get('/aameetings', function(req, res) {
    
    // Connect to the AWS RDS Postgres database
    const client = new Pool(db_credentials);
    
      // SQL query for all the locations, grouped by lat/long to plot marker on map only one for each location
      var thisQuery1 = `SELECT lat, long FROM aalocations GROUP BY lat, long;`;

      //query when a user select a specific marker, pass the long/lat coordinates and get all primary meeting info such as addresses, times, days and types at that location.  Could also do a sort by current time
      //var thisQuery2 = `SELECT address, day, hour, min, type FROM aalocations WHERE lat = 40.7346341 and long = -73.9879773;`;
      
      //additional query for an individual meeting for secondary detailed information like secondary address info and special interests, depending onuser selection
      //var thisQuery3 = `SELECT add2, details, access FROM aalocations WHERE type = 'B = Beginners meeting';`;
      //var thisQuery = `SELECT * FROM aalocations;`;
      //var thisQuery = "SELECT mtgday, mtgtime, mtglocation, mtgaddress, mtgtypes FROM aadata WHERE mtgday = 'Monday' and mtghour >= 7;";
      //var thisQuery3 = `SELECT address, day, hour, min, FROM aalocations WHERE address = '49 Fulton Street';`;
  
                 
   

    client.query(thisQuery1, (qerr, qres) => {
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
    AWS.config = new AWS.Config();
    //var dynamodb = new AWS.DynamoDB();
    AWS.config.accessKeyId = process.env.AWS_ID;
    AWS.config.secretAccessKey = process.env.AWS_KEY;
    AWS.config.region = "us-east-1";

    var dynamodb = new AWS.DynamoDB();

    
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