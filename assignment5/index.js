require('dotenv').config();
var AWS = require('aws-sdk');
var fs = require('fs');
AWS.config = new AWS.Config();
AWS.config.accessKeyId = process.env.AWS_ID;
AWS.config.secretAccessKey = process.env.AWS_KEY;
AWS.config.region = "us-east-1";

var diaryEntries = [];
var dynamodb = new AWS.DynamoDB();

//var content = [('October 9, 2018', 65, "light breeze and clouds", true, "moderate", true, "walking", "60 minutes", "relaxed"),('October 9, 2018', 85, 'light breeze and clouds', false, "none", true),('October 9, 2018', 78, 'light breeze and clouds', true, "low", false, "run", "45 minutes", "very tired and thirsty")]
   

class DiaryEntry {
   constructor(primaryKey, date, temperature, condition, exercise, motivation, sleep, type, duration, feel_after) {
    this.id = {};
    this.id.N = primaryKey.toString();
    this.date = {}; 
    this.date.S = new Date(date).toDateString();
    this.weather = {};
    this.weather.M = {};
        this.weather.M.temperature = {};
        this.weather.M.temperature.N = temperature.toString();
        this.weather.M.condition = {};
        this.weather.M.condition.S = condition;
    this.fitness = {};
    this.fitness.M = {};
        this.fitness.M.exercise = {};
        this.fitness.M.exercise.BOOL = exercise;
        this.fitness.M.motivation = {};
        this.fitness.M.motivation.S = motivation;
        if (exercise == true) {
            this.fitness.M.details = {};
            this.fitness.M.details.M = {};
                this.fitness.M.details.M.type = {};
                this.fitness.M.details.M.type.S = type;
                this.fitness.M.details.M.duration = {};
                this.fitness.M.details.M.duration.S = duration;
                this.fitness.M.details.M.feel_after = {};
                this.fitness.M.details.M.feel_after.S = feel_after;
        }
    this.sleep = {};
    this.sleep.BOOL = sleep;
    this.day = {};
    this.day.S = new Date(date).getDay().toString();

  }
}
 
console.log(diaryEntries);
populate();

function populate() { 
    diaryEntries.push(new DiaryEntry(getIndex(), 'October 9, 2018', 65, "light breeze and clouds", true, "moderate", true, "walking", "60 minutes", "relaxed" ));
    diaryEntries.push(new DiaryEntry(getIndex(), 'October 9, 2018', 85, 'light breeze and clouds', false, "none", true ));
    diaryEntries.push(new DiaryEntry(getIndex(), 'October 9, 2018', 78, 'light breeze and clouds', true, "low", false, "run", "45 minutes", "very tired and thirsty" ));
   
   console.log(diaryEntries);
}
buildDiary();

function getIndex(){
    var index = Math.floor(100000 + Math.random() * 900000);
    return index;
}

function buildDiary(){
    var params = {};
    diaryEntries.forEach(function(entry) {
        setTimeout(function(){
            params.Item = entry; 
            params.TableName = "dailynote";
            dynamodb.putItem(params, function (err, data) {
                if (err) console.log(err, err.stack); // an error occurred
                else     console.log(data);           // successful response
            });
        }, 2000);
        console.log("added item")
        }); 
    }

//console.log(diaryEntries);
//console.log(diaryEntries[0].fitness.details);
