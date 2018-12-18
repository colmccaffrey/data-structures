require('dotenv').config();
var express = require('express'), // npm install express
    app = express();
const { Pool } = require('pg');
var AWS = require('aws-sdk');
const moment = require('moment-timezone'); // moment-timezone --save

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

// sensor endpoint
app.get('/sensor', function(req, res) {
    
    // Connect to the AWS RDS Postgres database
    const client = new Pool(db_credentials);


    // SQL query 
    // select the month from sensortime and the day, count the sensor value for all values over 4 and
    // return as ounces, from table sensorData and group by  month and day
    var q = `SELECT to_char(sensorTime, 'Mon') as sensormonth,
             EXTRACT(DAY FROM sensorTime) as sensorday,
             COUNT(sensorValue::int) as ounces
             FROM sensorData
             WHERE sensorValue >= 4
             GROUP BY 1,2
             ORDER BY 1,2;`;
    

    client.connect();
    client.query(q, (qerr, qres) => {
        if (qerr) { throw qerr }
        else {
            res.send(qres.rows);
            client.end();
            console.log('1) responded to request for sensor data');
        }
    });
});

//end sensor endpoint query

// sensor query for ss template
app.get('/ss', function(req, res) {
    
    // Connect to the AWS RDS Postgres database
    const client = new Pool(db_credentials);
    // var d = new Date();
    // var today = parseInt(d.getDate());


    // SQL query 
    var q = `SELECT EXTRACT(DAY FROM sensorTime) as sensorday,
             COUNT(sensorValue::int) as ounces
             FROM sensorData
             WHERE sensorValue >= 4
             GROUP BY sensorday
             ORDER BY sensorday;`;
    
    client.query(q, (qerr, qres) => {
        if (qerr) { throw qerr }
        else {
            var resp = mx + JSON.stringify(qres.rows) + nx; 
            res.send(resp);
            client.end();
            console.log('1) responded to request for sensor graph');
        }
    });
});

// sql query for /aameetings endpoint
app.get('/aameetings', function(req, res) {
    //var chour = 3;
    const client = new Pool(db_credentials);
    //function get day string name from getDate()
        var d = new Date();
        var dayOfWeek = ['Sundays', 'Mondays', 'Tuesdays', 'Wednesdays', 'Thursdays', 'Fridays', 'Saturdays']
        var theday = dayOfWeek[d.getDay()];
        console.log(theday);

  
    // SQL query 
    //selects aa locations and sorts them by long/lat where day equals Monday and time is > 7pm and < 12am
    var thisQuery1 = `SELECT lat, long, COUNT(address), address, json_agg(json_build_object('add2', add2, 'loc', location, 'name', name, 'details', details, 'access', access, 'day', day, 'hr', hour, 'min', min, 'ampm', amPM, 'day', day, 'type', type, 'special', special)) as meetings
                        FROM aalocations
                        WHERE day = 'Mondays' and amPM = 'PM' and hour in ('7', '8', '9', '10', '11')
                        GROUP BY lat, long, address
                        ORDER BY lat, long
                        ;`;
  
    client.query(thisQuery1, (qerr, qres) => {
        if (qerr) { throw qerr }
        else {
            res.send(qres.rows);
            client.end();
            console.log('2) responded to request for aa meeting data');
        }
    });
});
//end sql query for aa meeting endpoint

// dynamo query for dear diary endpoint
app.get('/deardiary', function(req, res) {

    // Connect to the AWS DynamoDB database
    AWS.config = new AWS.Config();
    //var dynamodb = new AWS.DynamoDB();
    AWS.config.accessKeyId = process.env.AWS_ID;
    AWS.config.secretAccessKey = process.env.AWS_KEY;
    AWS.config.region = "us-east-1";

    var dynamodb = new AWS.DynamoDB();

    var newDate = new Date();
    var d = new Date();
    var today = JSON.stringify(d.getDate());
    console.log(today);
    console.log(typeof(today));
    // DynamoDB (NoSQL) query
    var params = {
        TableName: "deardiary", 
        KeyConditionExpression: "#dt = :entryDate", // the query expression

        //primary key expression attribute name
        ExpressionAttributeNames: { // name substitution, used for reserved words in DynamoDB
            "#dt": "pk",
        },

        //query results for specific date, could also query for a range
        ExpressionAttributeValues: { // the query values
            ":entryDate" : {S: "Tue Oct 09 2018"}
            // ":startDay": {S: "Tue Oct 09 2018"},
            // ":endDay": {S: "Thu Oct 11 2018"}

        }
    };
        
    dynamodb.query(params, function(err, data) {
        if (err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
        }
        else {
            res.send(data.Items);
            console.log(data.Items[0].pk.S);
        }
    });
});


// dear dear sql query for /dd interface
app.get('/dd', function(req, res) {

    // Connect to the AWS DynamoDB database
    AWS.config = new AWS.Config();
    //var dynamodb = new AWS.DynamoDB();
    AWS.config.accessKeyId = process.env.AWS_ID;
    AWS.config.secretAccessKey = process.env.AWS_KEY;
    AWS.config.region = "us-east-1";


    var dynamodb = new AWS.DynamoDB();

    // DynamoDB (NoSQL) query
    var params2 = {
        TableName: "deardiary",
        KeyConditionExpression: "#dt = :entryDate", // the query expression
        //primary key expression attribute name
        ExpressionAttributeNames: { // name substitution, used for reserved words in DynamoDB
            "#dt": "pk"
        },
        //query results for specific date, could also query for a range
        ExpressionAttributeValues: { // the query values - set equal to today
            ":entryDate": {S: "Tue Oct 09 2018"}
        }
    };

   
    dynamodb.query(params2, function(err, data) {
        if (err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
        }
        else {
            var temp = cx + JSON.stringify(data.Items) + dx;
            res.send(temp);
            console.log(data.Items[0].pk.S);
        }
    });
});


// create ss templates
var mx = `<!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <title></title>
    <script src="http://d3js.org/d3.v3.min.js" language="JavaScript"></script>
    <script src="js/liquidFillGauge.js" language="JavaScript"></script>
    <style>
        .liquidFillGaugeText { font-family: Helvetica; font-weight: bold; }
        .meta {
            text-align: center;
            color: #3E8AC5;
        }
    </style>
</head>
<body>
//create svg 
<svg id="fillgauge1" width="97%" height="250" onclick="gauge1.update(NewValue());"></svg>
<script language="JavaScript">
var data = 
`;

var nx = `;

//function to get the current day and month
    var dd = new Date();
    var d = new Date();
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var month = months[dd.getMonth()];
    var today = dd.getDate();
    var i;
    data.forEach(function (day,index){
        if (day.sensorday === today) {
            i = index;
        } 
    }) 
    
    //set query result to current, so svg onclick can let user get updated value
    var currentRead = data[i].ounces;

    //set new read to current read to compare values on click updates
    var newRead = currentRead;

    //set default and custom d3 settings
    var config1 = liquidFillGaugeDefaultSettings();
    config1.waveAnimateTime = 2000;

    //set the value of the guage svg to the current read divided by the daily goal of water consumption 
    //(recommended 64 ounces) * 100 so it returns as percent of daily goal
    var gauge1 = loadLiquidFillGauge("fillgauge1", Math.round(currentRead/64 * 100), config1);

    //function that updates the value on click to get latest sensor data, updates visualization with new values
    // also creates div with value and meta data and text depending on water consumption amount in ounces

    function NewValue(){
        console.log(month, today);
        newRead = data[i].ounces;
        console.log("new" + newRead);
        console.log("current" + currentRead);
        if(newRead > currentRead && newRead < 64){
            document.querySelectorAll('.meta').forEach(function(a){
                a.remove()
                })
            var div = document.createElement('div');
            div.className = 'meta';
            div.innerHTML = '<h3>' + month + ' ' + today + '<br/>' + '<h2>' + newRead + 'oz water consumed' + '</br>' + 'of 64oz daily goal' + '</h2>';
            document.getElementsByTagName('body')[0].appendChild(div);
            return Math.round(newRead/64 * 100); 
        } else if(newRead >= 64) {
            document.querySelectorAll('.meta').forEach(function(a){
                a.remove()
                })
            var div = document.createElement('div');
            div.className = 'meta';
            div.innerHTML = '<h2>Congrats you reached your daily goal!</h2>';
            document.getElementsByTagName('body')[0].appendChild(div); 
            return Math.round(newRead/64 * 100);
        } else {
            return Math.round(currentRead/64 * 100);
        }
    }
        var div = document.createElement('div');
        div.className = 'meta';
        div.innerHTML = '<h2>' + month + ' ' + today + '<br/>' + currentRead + 'oz water consumed' + '</br>' + 'of 64oz daily goal' + '</h2>';
        document.getElementsByTagName('body')[0].appendChild(div); 

</script>
</body>
</html>`;
//end ss template

// create dd templates
var cx = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Dear Diary</title>
  <meta name="description" content="Daily Health Snapshot">
  <meta name="author" content="DD">
  <link rel="stylesheet" type="text/css" href="css/styles.css"/>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/d3/4.9.1/d3.min.js" language="JavaScript"></script>

</head>
<body>
<div class="heatmap"></div>
<script>
var newdata = 
`;

var dx = `;

//create an empty array to push queried data into once reconfigured for visualization mapping
var data = new Array();
for (var i= 0; i < newdata.length; i++){
    var info = new Array();

    //functions for each value we want to map to visualization
    var infoSleep = getSleep(newdata[i].sleep.BOOL);
    var infoEx = getEx(parseInt(newdata[i].fitness.M.details.M.duration.S));
    var infoMot = getMot(newdata[i].fitness.M.motivation.S);
    info.push(infoSleep, infoEx, infoMot);

    //gets reults of each function as array and creates a new object for each
    for (var j = 0; j < info.length; j++){
    var item = new Object();
        item = {
            pos: j + 1,
            day: +newdata[i].day.S,
            value: info[j]
        }
    data.push(item);
    console.log("item" + item.value);
}}

//function to reformat sleep data
function getSleep(sData) {
    if (sData) {
        return 7;
    } else {
        return 1;
    }
}

//function to reformat exercise data
function getEx(eData) {
    var time = Math.round(eData/15) + 1;
    return time;
}

//function to reformat motivation
function getMot(mData) {
    console.log(mData);
    if (mData === 'low') {
        return 1;
    } else if (mData === 'moderate') {
        console.log('7');
        return 4;
    } else {
        return 7;
        }
}

console.log("data" + data[0].pos + data[0].day + data[0].value);

var dataLabels = ["Sleep", "Exercise", "Motivation"];

//set d3 configuration based on returned values and set color domain range
var colorDomain = d3.extent(data, function(d){
    console.log("d " + d.value);
        return d.value;
});

var colorScale = d3.scaleLinear()
  .domain(colorDomain)
  .range(["lightcyan","teal"]);

//append svg to div with class heatmap
var svg = d3.select(".heatmap")
.append("svg")
.attr("width", 500)
.attr("height", 500);

//create rectangles and set attributes
var rectangles = svg.selectAll("rect")
  .data(data)
  .enter()
  .append("rect")
 

rectangles
.attr("x", function(d){
  return d.day * 50 + 100; 
})

.attr("y", function(d){
  return d.pos * 50; 
})
.attr("width", 200)
.attr("height", 50). 
style("fill", function(d){
  return colorScale(d.value); 
}); 

//append text for each rectangles, append date and title, and more detailed information
//append all infromation to svg
var text = svg.selectAll("text")
                    .data(dataLabels)
                    .enter()
                    .append("text");

var textLabels = text
                 .attr("x", function(d) { return 202; })
                 .attr("y", function(d, i) { return i * 50 + 98; })
                 .text( function (d) { return d; })
                 .attr("font-family", "sans-serif")
                 .attr("font-size", "14px")
                 .attr("fill", "black");

var detailsDay = svg.selectAll("text.date")
        .data(newdata)
        .enter()
        .append("text")
        .attr("class", "date")
        .attr("font-size", "14px")
        .attr("fill", "black")
        .text( function(d) { return d.pk.S; })
        .attr("x", function(d) { return 200 })
        .attr("y", function(d) { return 20; });

var detailsWe = svg.selectAll("text.weather")
        .data(newdata)
        .enter()
        .append("text")
        .attr("class", "weather")
        .attr("font-size", "14px")
        .attr("fill", "black")
        .text( function(d) { return d.weather.M.condition.S + ', ' + d.weather.M.temperature.N + ' degrees';})
        .attr("x", function(d) { return 200; })
        .attr("y", function(d) { return 40; });

var detailsEx = svg.selectAll("text.exercise")
        .data(newdata)
        .enter()
        .append("text")
        .attr("class", "exercise")
        .attr("font-size", "14px")
        .attr("fill", "black")
        .text( function(d) { 
            if (d.fitness.M.exercise.BOOL) {
                var deets = d.fitness.M.details.M.duration.S + ' ' + d.fitness.M.details.M.type.S;
            } else {
                var deets = "No excerise";
            }
            return deets;
        })
        .attr("x", function(d) { return 200; })
        .attr("y", function(d) { return 250; }); 



</script>
</body>
</html>`;
//end dd template


// create AA templates
var hx = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>AA Meetings</title>
  <meta name="description" content="Meetings of AA in Manhattan">
  <meta name="author" content="AA">
  <link rel="stylesheet" type="text/css" href="css/styles.css"/>

  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.3.4/dist/leaflet.css"
   integrity="sha512-puBpdR0798OZvTTbP4A8Ix/l+A4dHDD0DGqYW6RQ+9jxkRFclaxxQb/SJAWZfWAkuyeQUytO7+7N4QKrDh+drA=="
   crossorigin=""/>

</head>
<body>
<div id="mapid"></div>
  <script src="https://unpkg.com/leaflet@1.3.4/dist/leaflet.js"
   integrity="sha512-nMMmRyTVoLYqjP9hrbed9S+FzjZHW5gY1TWCHA5ckwXZBadntCNs8kEqAWdrb9O7rxbCaA4lKTIWjDXZxflOcA=="
   crossorigin=""></script>
  <script>
  var grayscale = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
      id: 'mapbox.light', 
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      accessToken: 'pk.eyJ1Ijoidm9ucmFtc3kiLCJhIjoiY2pveGF0aDV2MjIyOTNsbWxlb2hhMmR4dCJ9.JJdYD_jWgRwUeJkDWiBz3w'
    });
  var data = 
  `;
  
var jx = `;

//setup leaflet map 
var mymap = L.map('mapid', {
        center: [40.734636,-73.959997],
        maxZoom: 18,
        zoom: 11.5,
        layers: [grayscale],
        accessToken: 'pk.eyJ1Ijoidm9ucmFtc3kiLCJhIjoiY2pveGF0aDV2MjIyOTNsbWxlb2hhMmR4dCJ9.JJdYD_jWgRwUeJkDWiBz3w'
    });


    //for each record create marker at long/long and load tooltip with address and count for number of meetings grouped at that long/lat
    for (var i=0; i<data.length; i++) {
        var marker = new L.marker([data[i].lat, data[i].long], { opacity: 1 }).addTo(mymap).on('click', markerOnClick); //opacity may be set to zero
        marker.address = data[i].address;
        marker.meetings = data[i].meetings;
        marker.bindTooltip(data[i].address + '<br />' + data[i].count + ' Meetings', {
            permanent: false, className: "my-label", offset: [0, 0] });
        
        //function that renders a sidebar div with address of long lat and all meetings at that long lat
        //with data for each meetings on click for each marker
        function markerOnClick(e){
            
            document.querySelectorAll('.details').forEach(function(a){
                a.remove()
                })
              
            var info = document.createElement('div');
            info.className = 'details';
            

            var meetingDetails = getMeetings(this.meetings);
            
            info.innerHTML = '<h2>' + this.address + '</h2>' + '<br/>' + meetingDetails.join('</br>');
            info.style.outline = '1px solid red';

            console.log("clicked!" + this.meetings);
            document.getElementsByTagName('body')[0].appendChild(info);        
        }
    }

    //function that gets meeting details for specific marker long/lat only
    function getMeetings(meetData){
        var meetingArray = new Array();
        var deets = "";
        for (var i = 0; i < meetData.length; i++) {

            //sets default values for missing data or undefined values
            if (meetData[i].details === 'NA') {
                meetData[i].details = '';
            } if (meetData[i].special === 'NA') {
                meetData[i].special = 'No special interests.';
            } if (meetData[i].access === 'NA') {
                meetData[i].access = 'Not wheelchair accessible';
            }
            deets = '<strong>' + meetData[i].day + ' at ' + meetData[i].hr + ':' + meetData[i].min + ' ' + meetData[i].ampm + '</strong><br/>' + meetData[i].name + '<br/>' + meetData[i].type + '<br/><p><strong>Details:</strong><br/>' +  meetData[i].add2 + '<br/>' + meetData[i].access + '<br/>' + meetData[i].details + '<br/>Special Interest: ' + meetData[i].special + '</p><hr>';
            meetingArray.push(deets);
        }
        return meetingArray;
    }


    </script>
    </body>
    </html>`;
//end aa template

// AA meetings sql query endpoint /aameetings
app.get('/aa', function(req, res) {


    // Connect to the AWS RDS Postgres database
    const client = new Pool(db_credentials);

    //var thisQuery = "CREATE TABLE aalocations (address varchar(200), lat double precision, long double precision, add2 varchar(200), location varchar(200), name varchar(200), details varchar(200), access varchar(100), day varchar (100), hour varchar (100), min varchar (100), amPm varchar (100), type varchar (200), special varchar (200) );";

    //select records from aalocations table grouped by long/lat where day is Monday and startime is >=7pm and < 12am
    // SQL query 
    var thisQuery = `SELECT lat, long, COUNT(address), address, json_agg(json_build_object('add2', add2, 'name', name, 'details', details, 'access', access, 'day', day, 'hr', hour, 'min', min, 'ampm', amPM, 'day', day, 'type', type, 'special', special)) as meetings
                    FROM aalocations
                    WHERE day = 'Mondays' and amPM = 'PM' and hour in ('7', '8', '9', '10', '11')
                    GROUP BY lat, long, address
                    ORDER BY lat, long
                    ;`;


    client.query(thisQuery, (qerr, qres) => {
        if (qerr) { throw qerr }
        
        else {
            var resp = hx + JSON.stringify(qres.rows) + jx;
            res.send(resp);
            client.end();
            console.log('2) responded to request for aa meeting data');
        }
    });
});

// serve static files in /public
app.use(express.static('public'));

// listen on port 8080
app.listen(8080, function() {
    console.log('Server listening...');
});