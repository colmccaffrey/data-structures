// npm install cheerio
var fs = require('fs');
var cheerio = require('cheerio');
var content = fs.readFileSync('data/text10.txt');
var meetingDT = [];
//var content = fs.readFileSync('../assignment1/data/text01.txt');

// load `content` into a cheerio object
var $ = cheerio.load(content);
//console.log($('div >table > tbody > tr > td:nth-child(1)').children().first().contents().text());
var addresses = $('div > table > tbody > tr > td:nth-child(1)').contents().not($('div >table > tbody > tr > td:nth-child(1)').children()).map(function () {
    return $(this).text().trim().replace(/\s+/g," ");
  }).get();
var locations = $('div > table > tbody > tr > td:nth-child(1) > h4').map(function () {
    return $(this).text().trim().replace(/\s+/g," ");
  }).get();
var names = $('div > table > tbody > tr > td:nth-child(1) > b').map(function () {
    return $(this).text().trim().replace(/\s+/g," ");
  }).get();
//add empty .detailsBox div to records without
$('div > table > tbody > tr > td:nth-child(1)').append('<div class="detailsBox">NA</div>');
var detailsbox = $('div > table > tbody > tr > td:nth-child(1) > div[class=detailsBox]').map(function () {
    return $(this).text().trim().replace(/\s+/g," ");
  }).get();
//add empty span to all records without wheelchair access
$('div > table > tbody > tr > td:nth-child(1)').append('<span>NA</span>');
var accessible = $('div > table > tbody > tr > td:nth-child(1) > span').map(function () {
        return $(this).text().trim().replace(/\s+/g," ");
  }).get();
$('div > table > tbody > tr > td:nth-child(2) > b').each(function(i, elem) {
    var theDate = ($(elem).text());
    if (theDate.split(' ')[1] === "From")
    //console.log("day" + theDate.split(' ')[0]);
    //console.log($(elem).text());
    meetingDT.push(theDate.split(' ')[0]);
})

var dayOfWeek = $('div > table > tbody > tr > td:nth-child(2) > b').map(function () {
    return $(this).text().trim().replace(/\s+/g," ");
  }).get();
    console.log(meetingDT);
    createAarray(addresses, locations, names, detailsbox, accessible, dayOfWeek, meetingDT);

function createAarray(recs, locs, meetingNames, deets, access, dayweek, meetDT) {
   // var recsCity = [];

    var cleanRecs = [];
    var deetRecs = [];
    var buildings = [];
    var mtgNames = [];
    var mtgDetails = [];
    var haccess = [];
    var daywk = [];
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
            deetRecs.push("");
        }
        buildings.push(locs[i]);
        mtgNames.push(meetingNames[i]);
        if (deets[i] !== "NA") {
            deets.splice(j, 1);
        }
        mtgDetails.push(deets[i]);
        if (access[i] === "Wheelchair access") {
            //var j = i + 1;
            access.splice(j, 1);
        }
        haccess.push(access[i]);
        daywk.push(dayweek[i]);
        //console.log(daywk);
    }

    //console.log(haccess)
    //createObject(recs);
    createFile(cleanRecs, deetRecs, buildings, mtgNames, mtgDetails, haccess);
}

function createFile(meetings, add2, location, name, details, access) {  
    var array = []; 
    var Record = {
        init: function (address, add2, location, name, details, access) {
            //this.id = id;
            this.address = address;
            this.add2 = add2;
            this.location = location;
            this.name = name;
            this.details = details;
            this.access = access;
        }
    };
  
    meetings.forEach(function (meeting, index) {
                var records = Object.create(Record);
                records.init(meeting, add2[index], location[index], name[index], details[index], access[index]);
                array.push(records);
    });
  
    fs.writeFileSync('data/m10-addresses.json', JSON.stringify(array));
}
