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
    for (var i = 0; i < recs.length; i++) {
        var item = recs[i];
        //console.log('test' + test.slice(-1));
        if (item.slice(-1) === ','){
            recs[i] = recs[i].split(',')[0];
           cleanRecs.push(recs[i].slice(0, item.length -1));
        }
    }
    recs = recs.filter(Boolean);
    

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
        },
        describe: function () {
            var description = this.id + " (" + this.location + ")";
            return description;
        }
    };
  
    meetings.forEach(function (meeting, index) {
        var records = Object.create(Record);
        records.init(index, meeting);
        array.push(records);
    });
  
    fs.writeFileSync('data/m10-addresses.json', JSON.stringify(array));
}

