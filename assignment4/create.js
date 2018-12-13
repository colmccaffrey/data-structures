require('dotenv').config();
const { Client } = require('pg');
var async = require('async');
var fs = require('fs');


// AWS RDS POSTGRESQL INSTANCE
var db_credentials = new Object();
db_credentials.user = 'colmac';
db_credentials.host = process.env.AWSRDS_EP;
db_credentials.database = 'datastructuresdb';
db_credentials.password = process.env.AWS_PW;
db_credentials.port = 5432;


for (var fileNum = 1; fileNum <= 10; fileNum++){
    insertZoneData(fileNum);
}

function insertZoneData(num) {
    var content = fs.readFileSync('../assignment7/data/m' + num + '-addresses.json');


//var addressesForDb = [ { address: '63 Fifth Ave, New York, NY', latLong: { lat: 40.7353041, lng: -73.99413539999999 } }, { address: '16 E 16th St, New York, NY', latLong: { lat: 40.736765, lng: -73.9919024 } }, { address: '2 W 13th St, New York, NY', latLong: { lat: 40.7353297, lng: -73.99447889999999 } } ];
//var content = fs.readFileSync('../assignment7/data/m1-addresses.json');
var contentFordb = JSON.parse(content);
//console.log("raw data");
//console.log(contentFordb);
populate(contentFordb);

function populate(addressesForDb) {
    async.eachSeries(addressesForDb, function(value, callback) {
        for (var i=0; i < value.info.length; i++){
        const client = new Client(db_credentials);
        client.connect();
        //MOVE DATA INSERTION INTO OWN JS FILE > OR KEEP IN CREATE, DONT ADD TO SLEECT OR IT WILL REPOPULATE TABLE WITH REDUNDANT DATA
        //E' > ESCAPES COMMAS WITHIN DATA VALUES SO IT DOESN'T PREMATURELY TRY TO SKIP ITEMS
        //address only, including long/lat
        //var thisQuery = "INSERT INTO aalocations VALUES (E'" + value.address + "', " + value.latLong.latitude + ", " + value.latLong.longitude + ");";
        //create full records
       // var thisQuery = `INSERT INTO aalocations VALUES (E'` +  value.address + `, ` + value.add2 + `, ` +  value.location + `, ` + value.name + `, ` + value.details + `', ` + value.access + `);`;
    //    "day": "Thursdays",
    //     "startHour": "2",
    //     "startMin": "30",
    //     "amPM": "PM",
    //     "type": "C = Closed Discussion meeting",
    //     "specialInterest": "NA"
    //queries can be grouped by starttime, days, or geolocation
    //created redundancy, but a separate table would eliminate that
        
       var thisQuery = `INSERT INTO aalocations VALUES (E'` + value.address + `',E'` + value.geo.lat + `',E'` + value.geo.long + `', E'` + value.add2 + `', E'` + value.location+ `', E'` + value.name + `', E'` + value.details + `', E'` + value.access + `', E'` + value.info[i].day + `', E'` + value.info[i].startHour + `', E'` + value.info[i].startMin + `', E'` + value.info[i].amPM + `', E'` + value.info[i].type + `', E'` + value.info[i].specialInterest + `');`;
       console.log(value.address);
        //var thisQuery = "SELECT * FROM aalocations;";
        
        client.query(thisQuery, (err, res) => {
            //console.log(err, res);
          client.end();
        }); 
    }

        setTimeout(callback, 1000); 
    }); 
}
}
