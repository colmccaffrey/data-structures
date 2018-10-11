var AWS = require('aws-sdk');
AWS.config = new AWS.Config();
AWS.config.accessKeyId = process.env.AWS_ID;
AWS.config.secretAccessKey = process.env.AWS_KEY;
AWS.config.region = "us-east-1";

var diaryEntries = [];
var dynamodb = new AWS.DynamoDB();



class DiaryEntry {
  constructor(primaryKey, date, temperature, condition, exercise, motivation, sleep, type, duration, feel_after) {
    this.id = {};
    this.id.N = primaryKey.toString();
    this.date = {}; 
    this.date.S = new Date(date).toDateString();
    this.weather = {};
    this.weather.N = temperature.toString();
    this.weather.S = condition;
    this.fitness = {};
    this.fitness.BOOL = exercise;
    this.fitness.S = motivation;
    if (exercise == true) {
        //nested attribute > use map M or list L?
        this.fitness.details.L = {};
        this.fitness.details.S = type; 
        this.fitness.details.S = duration;
        this.fitness.details.S = feel_after; 
    }
    this.sleep = {};
    this.sleep.BOOL = sleep;
    this.dow = {};
    this.dow.S = new Date(date).getDay().toString();

  }
}

populate();
//constructor(primaryKey, date, temperature, condition, exercise, type, duration, feel_after, sleep, dow) {
function populate() {
    diaryEntries.push(new DiaryEntry(1, 'October 9, 2018', "65", "light breeze and clouds", true, "moderate", true, "walking", "60 minutes", "relaxed" ));
    buildDiary();
}

/*
diaryEntries.push(new DiaryEntry(1, 'October 10, 2018', "75", "windy", true, "low", false, "running", "30 minutes", "good stuff but sore" ));
diaryEntries.push(new DiaryEntry(2, 'October 11, 2018', "80", "humid and sunny", false, "none", true ));


*/
function buildDiary(){
    var params = {};
    params.Item = diaryEntries[0]; 
    params.TableName = "dailynote";

dynamodb.putItem(params, function (err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
  });
}

console.log(diaryEntries);
//console.log(diaryEntries[0].fitness.details);



