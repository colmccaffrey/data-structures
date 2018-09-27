// npm install cheerio
var fs = require('fs');
var cheerio = require('cheerio');
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
   // var recsCity = [];
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
    

    //console.log(recs)
    //createObject(recs);
    createFile(cleanRecs);
}

function createFile(meetings) {  
    var array = []; 
    var Record = {
        init: function (id, address) {
            this.id = id;
            this.address = address;
        }
    };
  
    meetings.forEach(function (meeting, index) {
        var records = Object.create(Record);
        records.init(index, meeting);
        array.push(records);
    });
  
    fs.writeFileSync('data/m10-addresses.json', JSON.stringify(array));
}


//solution option to create json object using asyn
// https://stackoverflow.com/questions/38390168/write-array-object-to-json-in-node-js
//solution using object.create js methods
// https://openclassrooms.com/en/courses/3523231-learn-to-code-with-javascript/3703666-store-data-in-arrays
//initialize object var results = obejcet create init
//dont write array, first iterate through array and pursh each item into object
//then write object (using JSON stringify) into json file