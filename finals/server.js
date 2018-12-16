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

// respond to requests for /sensor
app.get('/sensor', function(req, res) {
    
    // Connect to the AWS RDS Postgres database
    const client = new Pool(db_credentials);

    // SQL query 
    var q = `SELECT EXTRACT(DAY FROM sensorTime) as sensorday,
             COUNT(sensorValue::int) as ounces
             FROM sensorData
             WHERE sensorValue >= 4
             GROUP BY sensorday
             ORDER BY sensorday;`;
    

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

var s1x = `<!DOCTYPE html>
<meta charset="utf-8">
<!-- Adapted from: http://bl.ocks.org/Caged/6476579 -->

<style>

body {
  font: 10px sans-serif;
}

.axis path,
.axis line {
  fill: none;
  stroke: #000;
  shape-rendering: crispEdges;
}

.bar {
  fill: orange;
}

.bar:hover {
  fill: orangered ;
}

.x.axis path {
  display: none;
}

.d3-tip {
  line-height: 1;
  font-weight: bold;
  padding: 12px;
  background: rgba(0, 0, 0, 0.8);
  color: #fff;
  border-radius: 2px;
}

/* Creates a small triangle extender for the tooltip */
.d3-tip:after {
  box-sizing: border-box;
  display: inline;
  font-size: 10px;
  width: 100%;
  line-height: 1;
  color: rgba(0, 0, 0, 0.8);
  position: absolute;
  text-align: center;
}

/* Style northward tooltips differently */
.d3-tip.n:after {
  margin: -1px 0 0 0;
  top: 100%;
  left: 0;
}
</style>
<body>
<script src="http://d3js.org/d3.v3.min.js"></script>
<script src="http://labratrevenge.com/d3-tip/javascripts/d3.tip.v0.6.3.js"></script>
<script>

var data = `;

var s2x = `; 

var margin = {top: 40, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var formatPercent = d3.format(".0%");

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(formatPercent);

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<strong>Percentage:</strong> <span style='color:red'>" + formatPercent(d.num_obs) + "</span>";
  })

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.call(tip);

  x.domain(data.map(function(d) { return d.sensorday; }));
  y.domain([0, d3.max(data, function(d) { return d.num_obs; })]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Percentage");

  svg.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.sensorday); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.num_obs); })
      .attr("height", function(d) { return height - y(d.num_obs); })
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)

</script>`;

app.get('/ss', function(req, res) {
    
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

// respond to requests for /aameetings
app.get('/aameetings', function(req, res) {
    
    // Connect to the AWS RDS Postgres database
    const client = new Pool(db_credentials);
    
    // SQL query 
    var thisQuery1 = `SELECT lat, long, COUNT(address), address FROM aalocations GROUP BY lat, long, address;`;

    // var thisQuery = `SELECT mtgaddress, mtglocation as location, json_agg(json_build_object('day', mtgday, 'time', mtgtime)) as meetings
    //              FROM aadata 
    //              WHERE mtgday = 'Tuesday' and mtghour >= 19 
    //              GROUP BY mtgaddress, mtglocation
    //              ;`;

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
            console.log(data.Items[0].pk.S);
        }
    });
});

// // respond to requests for /deardiary
// app.get('/deardiary', function(req, res) {
    
//     // AWS DynamoDB credentials
//     AWS.config = new AWS.Config();
//     AWS.config.accessKeyId = process.env.AWS_ID;
//     AWS.config.secretAccessKey = process.env.AWS_KEY;
//     AWS.config.region = "us-east-1";

//     // Connect to the AWS DynamoDB database
//     var dynamodb = new AWS.DynamoDB();
    
//     // DynamoDB (NoSQL) query
//     var params = {
//         TableName: "aarondiary",
//         KeyConditionExpression: "#tp = :topicName", // the query expression
//         ExpressionAttributeNames: { // name substitution, used for reserved words in DynamoDB
//             "#tp": "topic"
//         },
//         ExpressionAttributeValues: { // the query values
//             ":topicName": { S: "cats" }
//         }
//     };

//     dynamodb.query(params, function(err, data) {
//         if (err) {
//             console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
//         }
//         else {
//             res.send(data.Items);
//             console.log('3) responded to request for dear diary data');
//         }
//     });
// });

// respond to requests for /deardiary
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
        ExpressionAttributeNames: { // name substitution, used for reserved words in DynamoDB
            "#dt": "pk"
        },
        ExpressionAttributeValues: { // the query values - set equal to today
            ":entryDate": {S: "Thu Oct 11 2018"}
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
        .source {
            display: absolute;
            top: 5px;
        }
    </style>
</head>
<body>
<svg id="fillgauge1" width="97%" height="250" onclick="gauge1.update(NewValue());"></svg>
<script language="JavaScript">
var data = 
`;

var nx = `;
    var currentRead = data[0].ounces;
    var newRead = currentRead;
    var config1 = liquidFillGaugeDefaultSettings();
    config1.waveAnimateTime = 2000;
    var gauge1 = loadLiquidFillGauge("fillgauge1", Math.round(currentRead/64 * 100), config1);

    function NewValue(){
        newRead = 65;
        console.log("new" + newRead);
        console.log("current" + currentRead);
        if(newRead > currentRead && newRead < 64){
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
        div.innerHTML = '<h2>' + data[0].ounces + 'oz water consumed of 64oz daily goal' + '</h2>';
        document.getElementsByTagName('body')[0].appendChild(div); 

</script>
<div class="source"><a href="http://bl.ocks.org/brattonc/5e5ce9beee483220e2f6">d3 source</a></div>
</body>
</html>`;
//end ss template

// create dd templates
var cx = `<!doctype html>
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
<script>
var data = 
`;

var dx = `;

var div = document.createElement('div');
div.innerHTML = data[0].pk.S;

document.getElementsByTagName('body')[0].appendChild(div);        


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
    //  streets = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    //      id: 'mapbox.streets', 
    //      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    //      accessToken: 'pk.eyJ1Ijoidm9ucmFtc3kiLCJhIjoiY2pveGF0aDV2MjIyOTNsbWxlb2hhMmR4dCJ9.JJdYD_jWgRwUeJkDWiBz3w'

    //     });
  var data = 
  `;
  
var jx = `;
    //var mymap = L.map('mapid').setView([39.734636,-100.994997], 13);
    var mymap = L.map('mapid', {
        center: [40.734636,-73.959997],
        maxZoom: 18,
        zoom: 12.5,
        layers: [grayscale],
        accessToken: 'pk.eyJ1Ijoidm9ucmFtc3kiLCJhIjoiY2pveGF0aDV2MjIyOTNsbWxlb2hhMmR4dCJ9.JJdYD_jWgRwUeJkDWiBz3w'
    });

    // for (var i=0; i<data.length; i++) {
    //     L.marker( [data[i].lat, data[i].long] ).bindPopup(JSON.stringify(data[i].address)).addTo(mymap);
    // }

    // var circle = L.circle([data[i].lat, data[i].long], {
    //     color: 'blue',
    //     properties: {
    //             text: 122,            
    //         textColor: 'white',
    //     },
    //     fillOpacity: 0.5,
    //     radius: 10 * data[i].count
    // }).addTo(mymap);

    for (var i=0; i<data.length; i++) {
        var marker = new L.marker([data[i].lat, data[i].long], { opacity: 1 }).addTo(mymap).on('click', markerOnClick); //opacity may be set to zero
        marker.address = data[i].address;
        marker.meetings = data[i].meetings;
        marker.bindTooltip(data[i].address + '<br />' + data[i].count + ' Meetings', {
            permanent: false, className: "my-label", offset: [0, 0] });
        //marker.on('click', markerOnClick).addTo(mymap);  
        
        //     var marker = new L.marker([13.0102, 80.2157]).addTo(mymap).on('mouseover', onClick);
        //     marker.key = "marker-1";

        //     var marker2 =new  L.marker([13.0101, 80.2157]).addTo(mymap).on('mouseover', onClick);
        //     marker2.key = "marker-2";

        //     function onClick(e) {   
        //     alert(this.key); // i can expect my keys here
        // }

        function markerOnClick(e){
            
            document.querySelectorAll('.details').forEach(function(a){
                a.remove()
                })
                    //var iDiv = document.createElement('div');
                    // iDiv.id = 'block';
                    // iDiv.className = 'block';

                    // // Create the inner div before appending to the body
                    // var innerDiv = document.createElement('div');
                    // innerDiv.className = 'block-2';

                    // // The variable iDiv is still good... Just append to it.
                    // iDiv.appendChild(innerDiv);

                    // // Then append the whole thing onto the body
                    // document.getElementsByTagName('body')[0].appendChild(iDiv);
            var info = document.createElement('div');
            info.className = 'details';
            

            var meetingDetails = getMeetings(this.meetings);
            
            info.innerHTML = '<h2>' + this.address + '</h2>' + '<br/>' + meetingDetails.join('</br>');
            info.style.outline = '1px solid red';

            console.log("clicked!" + this.meetings);
            document.getElementsByTagName('body')[0].appendChild(info);        
        }
    }
    function getMeetings(meetData){
        var meetingArray = new Array();
        var deets = "";
        for (var i = 0; i < meetData.length; i++) {
            deets = meetData[i].name + '<br/>' + '<strong>' + meetData[i].day + '</strong>' + ' at ' + meetData[i].hr + ':' + meetData[i].min + ' ' + meetData[i].ampm + '<br/>';
            meetingArray.push(deets);
        }
        return meetingArray;
    }


    //   marker.on('click', function(e) {
    //     var tile = document.createElement('div');
    //     tile.innerHTML = "new dom";
    //     tile.style.outline = '1px solid red';
    //       console.log("marker clicked!");
    //     //marker.createData(e);

    //   });

   // }

    // function createData(e) {
    // var tile = document.createElement('div');
    // tile.innerHTML = "new dom";
    // tile.style.outline = '1px solid red';
    // return tile;
    // }

    // });

    //use this function to trigger marker click from element other than marker, ie button
      
    //   document.querySelector('button').addEventListener('click', function() {
    //     marker.fire('click');
    //   });

    </script>
    </body>
    </html>`;

// respond to requests for /aameetings
app.get('/aa', function(req, res) {

    // var now = moment.tz(Date.now(), "America/New_York"); 
    // var dayy = now.day().toString(); 
    // var hourr = now.hour().toString(); 

    // Connect to the AWS RDS Postgres database
    const client = new Pool(db_credentials);

    //var thisQuery = "CREATE TABLE aalocations (address varchar(200), lat double precision, long double precision, add2 varchar(200), location varchar(200), name varchar(200), details varchar(200), access varchar(100), day varchar (100), hour varchar (100), min varchar (100), amPm varchar (100), type varchar (200), special varchar (200) );";


    // SQL query 
    var thisQuery = `SELECT lat, long, COUNT(address), address, json_agg(json_build_object('add2', add2, 'loc', location, 'name', name, 'details', details, 'access', access, 'day', day, 'hr', hour, 'min', min, 'ampm', amPM, 'day', day, 'type', type, 'special', special)) as meetings
                    FROM aalocations 
                    GROUP BY lat, long, address
                    ;`;

    // var thisQuery = `SELECT lat, lon, json_agg(json_build_object('loc', mtglocation, 'address', mtgaddress, 'time', tim, 'name', mtgname, 'day', day, 'types', types, 'shour', shour)) as meetings
    //              FROM aadatall 
    //              WHERE day = ` + dayy + `and shour >= ` + hourr 
    //              GROUP BY lat, lon
    //              ;`;

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