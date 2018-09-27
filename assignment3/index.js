var request = require('request'); // npm install request
var async = require('async'); // npm install async
var fs = require('fs');
var cheerio = require('cheerio');
//set key from .env
require('dotenv').config();
var apiKey = process.env.KEY;
//test

var content = fs.readFileSync('data/text10.txt');
// load `content` into a cheerio object
var $ = cheerio.load(content);
//console.log($('div >table > tbody > tr > td:nth-child(1)').children().first().contents().text());
var addresses = $('div > table > tbody > tr > td:nth-child(1)').contents().not($('div >table > tbody > tr > td:nth-child(1)').children()).map(function () {
    return $(this).text().trim().replace(/\s+/g," ");
  }).get();

    //console.log(addresses);
    createAarray(addresses);

function createAarray(recs) {
    var cleanRecs = [];
    recs = recs.filter(Boolean);
    for (var i = 0; i < recs.length; i++) {
        var item = recs[i];
        //console.log('test' + test.slice(-1));
        if (item.slice(-1) === ','){
            recs[i] = recs[i].split(',')[0];
           cleanRecs.push(recs[i].slice(0, item.length -1));
        }
    }
    //create file passing parameter with cleaned array, first line of addresses only
    createFile(cleanRecs);
}

function createFile(meetings) { 
    var meetingsData = [];
    function setLocation (latitude, longitude) {
        return {
            latitude: latitude,
            longitude: longitude
        };
      }
    async.eachSeries(meetings, function(value, callback) {
    var apiRequest = 'https://geoservices.tamu.edu/Services/Geocode/WebService/GeocoderWebServiceHttpNonParsed_V04_01.aspx?';
    apiRequest += 'streetAddress=' + value.split(' ').join('%20');
    apiRequest += '&city=New%20York&state=NY&apikey=' + apiKey;
    apiRequest += '&format=json&version=4.01';
    
    request(apiRequest, function(err, resp, body) {
        if (err) {throw err;}
        else {
            var res = JSON.parse(body);
           // console.log(res);
            var lat = parseFloat(res['OutputGeocodes'][0].OutputGeocode.Latitude);
            var long = parseFloat(res['OutputGeocodes'][0].OutputGeocode.Longitude);
            //console.log(lat);
            //console.log(long);
            let meetingLocation = setLocation(lat, long);
            meetingsData.push(meetingLocation);
        }
    });
    setTimeout(callback, 2000);
    }, function() {
        fs.writeFileSync('first.json', JSON.stringify(meetingsData));
        console.log('*** *** *** *** ***');
        console.log('Number of meetings in this zone: ');
        console.log(meetingsData.length);
        var array = []; 
        const Record = {
            init: function (id, address, latLong) {
                this.id = id;
                this.address = address;
                this.latLong = latLong;
            }
        };
        meetings.forEach(function (meeting, index, locLongLat) {
            //locLongLat = {};
            var records = Object.create(Record);
            records.init(index, meeting, meetingsData[index]);
            array.push(records);
        });
    fs.writeFileSync('data/m10-addresses.json', JSON.stringify(array));
    });   
}