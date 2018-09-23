// npm install cheerio

var fs = require('fs');
var cheerio = require('cheerio');
var arr = [];
var content = fs.readFileSync('data/text10.txt');
// load `content` into a cheerio object
var $ = cheerio.load(content);
//console.log($('div >table > tbody > tr > td:nth-child(1)').children().first().contents().text());
var records = $('div > table > tbody > tr > td:nth-child(1)').contents().not($('div >table > tbody > tr > td:nth-child(1)').children()).map(function () {
    return $(this).text().trim().replace(/\s+/g," ");
  }).get();

createAarray(records);

function createAarray(recs) {
    recs = recs.filter(Boolean).join('\n');
    console.log(recs)
   createFile(recs);
}


//var addies = records.replace(/(\r\n|\n|\r)/g, '').replace(/\s+/g,' ');
function createFile(array) {   
    fs.writeFileSync('data/m10-addresses.json', array);
    console.log("created");
}