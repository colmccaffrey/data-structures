//set key from .env
require('dotenv').config();
var apiKey = process.env.KEY;
var async = require('async');
var request = require('request'); 



// npm install cheerio
var fs = require('fs');
var cheerio = require('cheerio');


for (var fileNum = 1; fileNum <= 10; fileNum++){
    getZoneData(fileNum);
}

function getZoneData(num) {
if (num >= 10) {
    var content = fs.readFileSync('../assignment1/data/text' + num +  '.txt');
    } else {
    var content = fs.readFileSync('../assignment1/data/text' + '0' + num +  '.txt');
}
var meetingTimes = [];
var startTimes = [];
var meetingDt = [];
var meetingDays = [];
var newmtgtime = [];
var newCleanTimes = [];
var daysTimesMeets = [];
var specialInt;
var meetingList = [];
//var content = fs.readFileSync('../assignment1/data/text01.txt');

// load `content` into a cheerio object
var $ = cheerio.load(content);
//console.log($('div >table > tbody > tr > td:nth-child(1)').children().first().contents().text());
var addresses = $('div > table > tbody > tr > td:nth-child(1)').contents().not($('div >table > tbody > tr > td:nth-child(1)').children()).map(function () {
    return $(this).text().trim().replace(/\s+/g," ").replace(/'/g, '"');
  }).get();
var locations = $('div > table > tbody > tr > td:nth-child(1) > h4').map(function () {
    return $(this).text().trim().replace(/\s+/g," ").replace(/'/g, '"');
  }).get();
var names = $('div > table > tbody > tr > td:nth-child(1) > b').map(function () {
    return $(this).text().trim().replace(/\s+/g," ").replace(/'/g, '"');
  }).get();
//add empty .detailsBox div to records without
$('div > table > tbody > tr > td:nth-child(1)').append('<div class="detailsBox">NA</div>');
var detailsbox = $('div > table > tbody > tr > td:nth-child(1) > div[class=detailsBox]').map(function () {
    return $(this).text().trim().replace(/\s+/g," ").replace(/'/g, '"');
  }).get();
//add empty span to all records without wheelchair access
$('div > table > tbody > tr > td:nth-child(1)').append('<span>NA</span>');
var accessible = $('div > table > tbody > tr > td:nth-child(1) > span').map(function () {
        return $(this).text().trim().replace(/\s+/g," ");
  }).get();
$('div > table > tbody > tr > td:nth-child(2) > b').each(function(i, elem) {
    var theDate = ($(elem).text());
    if (theDate.split(' ')[1] === "From") {
    //console.log("day" + theDate.split(' ')[0]);
    //console.log($(elem).text());
    var dayOfMeeting = theDate.split(' ')[0];
    //console.log(dayOfMeeting);
    }
    var beginTime = ($(elem));
   // console.log(" begin time" + beginTime);
    //meetingDt.push(theDate.split(' ')[0]);
})

//this has all the content in an array- just need to remove the blank spaces and determine which one is a break
//try cloning an array to get date and then time
//assign meeting id as you iterate through then serach by meeting id in query to match othe rdetails with meeting times?
$('div > table > tbody > tr > td:nth-child(2)').each(function(i, elem) {
    var el = ($(elem).contents()).map(function () {
    return $(this).text().trim();
    }).get();
    
    //el.forEach(function (meetdeet, index) {
    //var disOne =  meetdeet.split('</br></br>');
    //var day = el.split('From')
    newmtgtime.push(el); 
    })
    // //console.log(newmtgtime[0]);
    newmtgtime.forEach(function (spacedMeeting, index){
        let cleanmtgtime = spacedMeeting.filter(a => a !== '');
        newCleanTimes.push(cleanmtgtime);
    })
    createMeetingTimes(newCleanTimes);

    function createMeetingTimes(meetingInfo) {
       //console.log(meetingInfo);
       //console.log(meetingInfo.length);
       

       var createAllMeetings = new Object();
       for (var m = 0; m < meetingInfo.length; m++){
        var allMeetings = new Array();

        // var numMeetingTimes = Math.ceil(meetingInfo[m].length/8);
        var numMeetingTimes = meetingInfo[m].length;
         //console.log(numMeetingTimes);
        // console.log(meetingInfo[m]);
        

        for (var n = 0; n < numMeetingTimes; n++){
        let newArr = meetingInfo[m][n];
        //console.log(newArr);
        var thisMeeting = new Object();

        if (newArr.includes("From")){
        //     console.log("m" + m + "n" + n + " day " + meetingInfo[m][n].split('From')[0]);
        //     console.log("startHour" + meetingInfo[m][n+1].split('From')[0].split(':')[0]);
        //     console.log("startMin" + meetingInfo[m][n+1].split(':')[1].split(' ')[0]);
        //     console.log("amPM" + meetingInfo[m][n+1].split(' ')[1]);
        //     console.log("type" + meetingInfo[m][n+5]);
            
        //     if (meetingInfo[m][n+6] === "Special Interest"){
        //         console.log("special" + meetingInfo[m][n+7]);
        //     }

        // }
        if (meetingInfo[m][n+6] === "Special Interest"){
            specialInt = meetingInfo[m][n+7];
        } else {
            specialInt = "NA";
        }

            allMeetings.push({
                    day: meetingInfo[m][n].split('From')[0].trim(),
                    startHour:  meetingInfo[m][n+1].split('From')[0].split(':')[0],
                    startMin: meetingInfo[m][n+1].split(':')[1].split(' ')[0],
                    amPM:   meetingInfo[m][n+1].split(' ')[1],
                    type:   meetingInfo[m][n+5],
                    specialInterest:  specialInt           
                })
         //} 
         //console.log(thisMeeting);
            // allMeetings.push(thisMeeting)
             //console.log(allMeetings);
            }
        }
        createAllMeetings =  {
            meetings: allMeetings
        }
        // console.log(createAllMeetings);
        meetingList.push(createAllMeetings);

       }   //createAllMeetings.push({allMeetings})
    //    console.log(createAllMeetings.meetings);

    }
       // console.log(meetingList);

    
createAarray(addresses, locations, names, detailsbox, accessible, meetingList);

function createAarray(recs, locs, meetingNames, deets, access, meetList) {
   // var recsCity = [];
    
    var cleanRecs = [];
    var deetRecs = [];
    var buildings = [];
    var mtgNames = [];
    var mtgDetails = [];
    var haccess = [];
    recs = recs.filter(Boolean);
    //console.log(locs.length);
    //console.log(recs.length);
    for (var i = 0; i < recs.length; i++) {
        var item = recs[i];
        var item2 = "";
        var item3 = "";
        //console.log(i);
        //console.log(recs[i].split(',')[1]);
        //if (item.slice(-1) === ',' || recs[i].split(',')[1] != ) {
            item1 = recs[i].split(',')[0];
            item2 = recs[i].split(',')[1];
            cleanRecs.push(item1);
            //deetRecs.push(item2);
        //} else {
            //cleanRecs.push(item);
            //deetRecs.push(null);
        //}
        var j = i + 1;
        if (recs[j].slice(-1) !== ',') {
            //console.log(recs[j]);
            var item3 = recs[j]
            if (item2) {
                deetRecs.push(item2 + ", " + item3)
            } else {
                deetRecs.push(item3)
            }
            recs.splice(j, 1);
        } else {
            deetRecs.push("NA");
        }
        buildings.push(locs[i]);
        mtgNames.push(meetingNames[i]);
        if (deets[i] !== "") {
            deets.splice(j, 1);
        }
        mtgDetails.push(deets[i]);
        if (access[i] === "Wheelchair access") {
            //var j = i + 1;
            access.splice(j, 1);
        }
        haccess.push(access[i]);
        //daywk.push(meetDay[i]);
        //console.log(daywk);
    }
    
    createFile(cleanRecs, deetRecs, buildings, mtgNames, mtgDetails, haccess, meetList);
   
    //console.log("geo " + geo.length);
    //createFile(cleanRecs, deetRecs, buildings, mtgNames, mtgDetails, haccess, meetList);
}


function getGeoLocate(meetings) {
    return new Promise(resolve => {
        setTimeout(() => {
     
    var meetingsData = [];
    var geoarray = []; 

    function setLocation (latitude, longitude) {
            return {
                lat: latitude,
                long: longitude
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
                console.log(lat);
                console.log(long);
                let meetingLocation = setLocation(lat, long);
                meetingsData.push(meetingLocation);
            }
        });
        setTimeout(callback, 2000);
        }, function() {
        // fs.writeFileSync('geo.json', JSON.stringify(meetingsData));
        console.log('*** *** *** *** ***');
        console.log('Number of meetings in this zone: ');
        console.log(meetingsData.length);
        const Georecord = {
            //could init building id and address here if want separate tables for meeting info and location info
            init: function (latLong) {
                this.latLong = latLong;
            }
        };
        meetings.forEach(function (meeting, index) {
            var georecords = Object.create(Georecord);
            georecords.init(meetingsData[index]);
            geoarray.push(georecords);
        });
        
        //fs.writeFileSync('data/geo-addresses-' + num + '.json', JSON.stringify(geoarray));
        //console.log("geoarray" + geoarray);
                //return geoarray;

                resolve(geoarray);
            }, 10000);
         });
         
        })
    }

async function createFile(meetings, add2, location, name, details, access, info) {  
    //console.log("geo length" + geo.length);
    console.log('calling');

    //const geo = getGeoLocate(meetings);
    var geo = await getGeoLocate(meetings);
    console.log(geo.length);


    var array = []; 
    var Record = {
        init: function (address, geo, add2, location, name, details, access, info) {
            //this.id = id;
            this.address = address;
            this.geo = geo.latLong;
            this.add2 = add2;
            this.location = location;
            this.name = name;
            this.details = details;
            this.access = access;
            this.info = info.meetings;
        }
    };
  
    meetings.forEach(function (meeting, index) {
                var records = Object.create(Record);
                records.init(meeting, geo[index], add2[index], location[index], name[index], details[index], access[index], info[index]);
                array.push(records);
    });
    
    fs.writeFileSync('data/m' + num + '-addresses.json', JSON.stringify(array));
    }
}
