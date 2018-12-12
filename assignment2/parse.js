// npm install cheerio
var fs = require('fs');
var cheerio = require('cheerio');
var content = fs.readFileSync('data/text10.txt');
var meetingTimes = [];
var startTimes = [];
var meetingDt = [];
var meetingDays = [];
var newmtgtime = [];
var newCleanTimes = [];
var daysTimesMeets = [];
var specialInt;
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
                    day: meetingInfo[m][n].split('From')[0],
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
             createAllMeetings =  {
                meetings: allMeetings
            }

        }
            
        console.log(createAllMeetings.meetings);

       }   //createAllMeetings.push({allMeetings})
    //    console.log(createAllMeetings.meetings);

    }

    // createAllMeetings = {
    //     meetings: allMeetings



//         meetingInfo.forEach(function (dateTime, index){
//         //console.log("length" + dateTime.length);         
//         var numMeetingTimes = Math.floor(dateTime.length/6);
//         //console.log(numMeetingTimes);
//         //var allMeetings = new Array();
//         var j = 0;
//         var s = 0;
        
//         for (var i = 0; i <= numMeetingTimes; i ++ ){
//             //var thisMeeting = new Array();
//             //var infoString = dateTime.join();

//             //console.log(infoString);


//            //console.log(dateTime);
//                 thisMeeting.push({
//                     meetings: {
//                         //day: dateTime.split('From')[0],
//                         //startHour: dateTime.split(':')[0]

//                     } 
//                 })
            
//                 // thisMeeting = { 
//                 //     day: dateTime[0 + s + j].split(' ')[0],
//                 //     startHour:  dateTime[1 + s + j].split(':')[0],
//                 //     startMin: dateTime[1 + s + j].split(':')[1].split(' ')[0],
//                 //     amPM:   dateTime[1 + s + j].split(' ')[1],
//                 //     type:   dateTime[5 + s + j],
//                 //     specialInterest:  + checkData(dateTime[6 + s + j], dateTime[7 + s + j])
                
//                 // }
//                 //figure out how to set special interest if it doesnt exist and not fuck everything else up
//                 if (dateTime[6 + s + j] === "Special Interest") {
//                     s = s + 2;
//                     j = j + 6;

//                 } else {
//                     s = s;
//                     j = j + 6;
//                 }
                
               
//                 //console.log(thisMeeting);
//             }
//             // allMeetings.push({
//             //     meetings:  thisMeeting
//             // });
//             daysTimesMeets.push(thisMeeting);

//             //need to write a function to check for more than one meeting time for each meeting and push into same object for each m
//          }) 

//     }

//     //console.log("meetings" + daysTimesMeets);


// function checkData(info, special) {
//    if (info === "Special Interest" ) {
//         //console.log(info);
//         return special;
//     } else {
//         //console.log("na");
//         return "NA";
//     }
// }
/*
var dayOfWeek = $('div > table > tbody > tr > td:nth-child(2) > b').map(function () { .children()).map(function () {
    return $(this).text().trim().replace(/\s+/g," ").replace(/'/g, '"');
    return $(this).text().trim().replace(/\s+/g," ");
  }).get();
  
    //console.log(meetingDt);

//splits the information for meetings
$('div > table > tbody > tr > td:nth-child(2)').each(function(i, elem) {
    var beginTime = ($(elem).contents());
    //if (beginTime.split(' ')[1] === "From")
    //console.log("day" + theDate.split(' ')[0]);
    //console.log(beginTime[i]);
    meetingTimes.push(beginTime);
    
    })
    //console.log(meetingTimes);
    meetingTimes.forEach(function (index, daysTimes){
        var meetingDeets = daysTimes;
        //console.log(meetingDeets);
    //var eachMeetingTime = beginTime.split('<br /> <br />');
    //console.log(eachMeetingTime);
   // eachMeetingTime.forEach(function (meetingTime, index) {
        //console.log(meetingTime[0])
        //if (meetingTime !== "") {
            //var dayMeetingTime = meetingTime.split(',');
            //console.log("meeting times " + dayMeetingTime[0]);
           // }
    //})
})

       // meetingDays.push(beginTime.split(',')[0]);

    //startTimes.push(beginTime.split(' ')[1])

     //console.log("meeting days " + dayOfMeeting);
    */

    
createAarray(addresses, locations, names, detailsbox, accessible, meetingDt);

function createAarray(recs, locs, meetingNames, deets, access, meetDay) {
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
        daywk.push(meetDay[i]);
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
