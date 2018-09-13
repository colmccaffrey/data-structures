// npm install request
// mkdir data

var request = require('request');
var fs = require('fs');
var x;
var j = 10; 

for (var i = 1; i <= j; i++) {
    if (i < j) {
        x = '0' + i;
        //console.log(" less than" + x);
    } else {
        x = i;
    }
    pullData(x);
}

function pullData(fileName) {
    request("https://parsons.nyc/aa/m" + fileName + ".html", function(error, response, body){
        if (!error && response.statusCode == 200) {
            fs.writeFileSync("/Users/colleenmccaffrey/Documents/Data Structures/data-structures/assignment1/data/text" + fileName + ".txt", body);
        }
        else {console.log("Request failed!")}
    });
}