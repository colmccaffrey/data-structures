// npm install cheerio

var fs = require('fs');
var cheerio = require('cheerio');

// load the thesis text file into a variable, `content`
// this is the file that we created in the starter code from last week
var content = fs.readFileSync('data/text10.txt');
// load `content` into a cheerio object
var $ = cheerio.load(content);
// print (to the console) names of thesis students
//console.log($('div >table > tbody > tr > td:nth-child(1)').children().first().contents().text());
//console.log($('div >table > tbody > tr > td:nth-child(1)').contents().not($('div >table > tbody > tr > td:nth-child(1)').children()).text());
var records = $('div > table > tbody > tr > td:nth-child(1)').contents().not($('div >table > tbody > tr > td:nth-child(1)').children()).map(function () {
    return $(this).text().trim().replace(/\s+/g,' ');
  }).get();

console.log(records);
//addies = JSON.parse(records);

fs.writeFileSync('data/m10-addresses.txt', records);

/*
.map(function () {
    return $(this).text();
  }).get();

//console.log($('tbody').children().first().contents().text());
//console.log(test1);
//.not($('tbody tr').children())
//$("#foo").contents().not($("#foo").children()).text();

/*.each(function(i, elem) {
    console.log($(elem).html()); 
});*/

//console.log($('tr td').childNodes);

// write the project titles to a text file
/*var thesisTitles = ''; // this variable will hold the lines of text

$('.project .title').each(function(i, elem) {
    thesisTitles += ($(elem).text()) + '\n';
});

fs.writeFileSync('data/thesisTitles.txt', thesisTitles);
*/