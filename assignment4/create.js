require('dotenv').config();
const { Client } = require('pg');
var async = require('async');
var fs = require('fs');


// AWS RDS POSTGRESQL INSTANCE
var db_credentials = new Object();
db_credentials.user = 'adminc';
db_credentials.host = 'colmacdb.cad780eu8lhp.us-east-1.rds.amazonaws.com';
db_credentials.database = 'aa_newdb';
db_credentials.password = process.env.AWS_PW;
db_credentials.port = 5432;


//var addressesForDb = [ { address: '63 Fifth Ave, New York, NY', latLong: { lat: 40.7353041, lng: -73.99413539999999 } }, { address: '16 E 16th St, New York, NY', latLong: { lat: 40.736765, lng: -73.9919024 } }, { address: '2 W 13th St, New York, NY', latLong: { lat: 40.7353297, lng: -73.99447889999999 } } ];
var content = fs.readFileSync('../assignment3/data/m10-addresses.json');
var contentFordb = JSON.parse(content);
console.log(contentFordb);
populate(contentFordb);


function populate(addressesForDb) {
    async.eachSeries(addressesForDb, function(value, callback) {
        const client = new Client(db_credentials);
        client.connect();

        var thisQuery = "INSERT INTO aalocations VALUES (E'" + value.address + "', " + value.latLong.latitude + ", " + value.latLong.longitude + ");";
        //var thisQuery = "SELECT * FROM aalocations;";
        client.query(thisQuery, (err, res) => {
            console.log(err, res);
            client.end();
        }); 
        setTimeout(callback, 1000); 
    }); 

}
