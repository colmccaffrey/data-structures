// npm install cheerio

var fs = require('fs');
var cheerio = require('cheerio');

var content = fs.readFileSync('data/text10.txt');
// load `content` into a cheerio object
var $ = cheerio.load(content);
//console.log($('div >table > tbody > tr > td:nth-child(1)').children().first().contents().text());
var records = $('div > table > tbody > tr > td:nth-child(1)').contents().not($('div >table > tbody > tr > td:nth-child(1)').children()).map(function () {
    return $(this).text().trim().replace(/(\r\n|\n|\r)/gm, '').replace(/\s+/g,' ');
  }).get().join('\n');

console.log(records);
//addies = JSON.parse(records);

fs.writeFileSync('data/m10-addresses.txt', records);