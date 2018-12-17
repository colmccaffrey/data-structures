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
   constructor(date, temperature, condition, exercise, motivation, sleep, type, duration, feel_after) {
   // this.id = {};
    //this.id.N = primaryKey.toString();
    this.pk = {}; 
    this.pk.S = new Date(date).toDateString();
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
    diaryEntries.push(new DiaryEntry("October 9, 2018", 65, "light breeze and clouds", true, "moderate", true, "walking", "60 minutes", "relaxed" ));
    diaryEntries.push(new DiaryEntry("October 10, 2018", 85, "hot and humid", false, "low", true ));
    diaryEntries.push(new DiaryEntry("October 11, 2018", 78, "warm", false, "low", false ));
    diaryEntries.push(new DiaryEntry("October 12, 2018", 78, "warm", false, "low", false ));
    diaryEntries.push(new DiaryEntry("October 13, 2018", 57, "cold", false, "low", false ));
    diaryEntries.push(new DiaryEntry("October 14, 2018", 57, "cloudy", true, "low", false, "run", "30 minutes", "good" ));
    diaryEntries.push(new DiaryEntry("October 15, 2018", 68, "overcast", true, "high", true, "elliptical", "45 minutes", "energized" ));
    diaryEntries.push(new DiaryEntry("October 16, 2018", 63, "cloudy and cool", false, "low", false ));
    diaryEntries.push(new DiaryEntry("October 17, 2018", 68, "cloudy and cool", false, "low", false ));
    diaryEntries.push(new DiaryEntry("October 18, 2018", 62, "overcast and cool", true, "moderate", false, "run", "45 minutes", "thirsty" ));
    diaryEntries.push(new DiaryEntry("October 19, 2018", 58, "sun and cool", false, "low", true ));
    diaryEntries.push(new DiaryEntry("October 20, 2018", 61, "rainy and cool", true, "moderate", false, "run", "45 minutes", "good" ));
    diaryEntries.push(new DiaryEntry("October 21, 2018", 54, "sunny", true, "low", true, "elliptical", "30 minutes", "hungry" ));
    diaryEntries.push(new DiaryEntry("October 22, 2018", 55, "sunny", false, "low", false ));
    diaryEntries.push(new DiaryEntry("October 23, 2018", 56, "some clouds", true, "low", false, "run", "45 minutes", "very tired and thirsty" ));
    diaryEntries.push(new DiaryEntry("October 24, 2018", 69, "cloudy", false, "low", false ));
    diaryEntries.push(new DiaryEntry("October 25, 2018", 64, "sunny and cool", false, "low", false ));
    diaryEntries.push(new DiaryEntry("October 26, 2018", 54, "sunny and cool", false, "low", false ));
    diaryEntries.push(new DiaryEntry("October 27, 2018", 53, "some clouds and cold", true, "high", false, "walk", "60 minutes", "refreshed" ));
    diaryEntries.push(new DiaryEntry("October 28, 2018", 57, "sunny and cool", true, "low", true, "run", "45 minutes", "energized and hungry" ));
    diaryEntries.push(new DiaryEntry("October 29, 2018", 58, "cloudy and cool", false, "low", false ));
    diaryEntries.push(new DiaryEntry("October 30, 2018", 60, "sunny and cool", true, "low", true, "run", "20 minutes", "hungry" ));
    diaryEntries.push(new DiaryEntry("October 31, 2018", 65, "cool and sunny", false, "low", false ));
    diaryEntries.push(new DiaryEntry("November 1, 2018", 63, "cool and sunny", false, "low", false ));
    diaryEntries.push(new DiaryEntry("November 2, 2018", 62, " cool", false, "low", false ));
    diaryEntries.push(new DiaryEntry("November 3, 2018", 56, "rainy ", false, "low", false ));
    diaryEntries.push(new DiaryEntry("November 4, 2018", 55, "some sun", false, "low", false ));
    diaryEntries.push(new DiaryEntry("November 5, 2018", 52, "cool", true, "moderate", false, "run", "45 minutes", "very tired" ));
    diaryEntries.push(new DiaryEntry("November 6, 2018", 63, " cool", false, "low", true ));
    diaryEntries.push(new DiaryEntry("November 7, 2018", 51, " cool", false, "low", false ));
    diaryEntries.push(new DiaryEntry("November 8, 2018", 57, "cool", false, "low", false ));
    diaryEntries.push(new DiaryEntry("November 9, 2018", 53, "sunny", true, "high", false, "stairs", "30 minutes", "very tired" ));
    diaryEntries.push(new DiaryEntry("November 10, 2018", 58, "rainy and windy", false, "low", false ));
    diaryEntries.push(new DiaryEntry("November 11, 2018", 45, "cold", true, "low", false, "run", "45 minutes", "very tired and thirsty" ));
    diaryEntries.push(new DiaryEntry("November 12, 2018", 44, "windy", false, "moderate", false ));
    diaryEntries.push(new DiaryEntry("November 13, 2018", 52, "rainy and cold", false, "low", false ));
    diaryEntries.push(new DiaryEntry("November 14, 2018", 41, "cold", false, "low", false ));
    diaryEntries.push(new DiaryEntry("November 15, 2018", 48, "cold", true, "low", false, "walk", "60 minutes", "thirsty" ));
    diaryEntries.push(new DiaryEntry("November 16, 2018", 49, "rainy and cold", false, "low", false ));
    diaryEntries.push(new DiaryEntry("November 17, 2018", 43, "some sun, cold", false, "low", false ));
    diaryEntries.push(new DiaryEntry("November 18, 2018", 51, "overcast", false, "low", false ));
    diaryEntries.push(new DiaryEntry("November 19, 2018", 42, "cloudy", true, "moderate", false, "run", "25 minutes", "good" ));
    diaryEntries.push(new DiaryEntry("November 20, 2018", 47, "cloudy", false, "low", true ));
    diaryEntries.push(new DiaryEntry("November 21, 2018", 45, "cloudy", true, "low", false, "walk", "45 minutes", "energized" ));
   
   console.log(diaryEntries);
}
buildDiary();

function buildDiary(){
    var params = {};
    diaryEntries.forEach(function(entry) {
        setTimeout(function(){
            params.Item = entry; 
            params.TableName = "deardiary";
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
