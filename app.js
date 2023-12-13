require('dotenv').config()
const express = require ("express");
const bodyParser = require("body-parser");
// const request = require('request');
const https = require("https"); // ไม่ต้อง npm i https เพราะว่าเป็น native ของ nodejs
const app = express();

// Middleware การส่งค่าผ่าน Form (URLencoded)
app.use(bodyParser.urlencoded({extended:false}));

app.get("/", (req,res) =>{
    res.sendFile(__dirname + "/index.html");
});

app.get("/gettemp", (req,res) =>{

    const url = 'https://api.openweathermap.org/data/2.5/weather?q=bangkok&appid='+process.env.API_KEY+'&units=metric';
    https.get(url, (response)=>{
        console.log(response);
        console.log(response.statusCode);

        response.on("data", (data)=>{
            let weatherData = JSON.parse(data);
            console.log(weatherData);
            const icon = weatherData.weather[0].icon;
            let imgURL = "http://openweathermap.org/img/wn/"+icon+"@2x.png";
            res.writeHead(200, {"Content-type":"text/html; charset=utf-8"});
            res.write("<p>ณ จังหวัด "+weatherData.name+"</p>");
            res.write("<p>มีอากาศ "+weatherData.main.temp+"</p>");
            res.write("<p>สภาพอากาศในตอนนี้ "+weatherData.weather[0].description+"</p>");
            res.write("<img src="+imgURL+" >");
            res.send();
        });

    });
})

app.post("/displaytemp", (req,res) =>{

    const url = 'https://api.openweathermap.org/data/2.5/weather?q='+req.body.cityName+'&appid='+process.env.API_KEY+'&units=metric';
    https.get(url, (response)=>{
        console.log(response);
        console.log(response.statusCode);
        if (response.statusCode == 404) res.send("ไม่มีเมืองดังกล่าว")

        response.on("data", (data)=>{
            let weatherData = JSON.parse(data);
            console.log(weatherData);
            const icon = weatherData.weather[0].icon;
            let imgURL = "http://openweathermap.org/img/wn/"+icon+"@2x.png";
            res.writeHead(200, {"Content-type":"text/html; charset=utf-8"});
            res.write("<p>ณ จังหวัด "+weatherData.name+"</p>");
            res.write("<p>มีอากาศ "+weatherData.main.temp+"</p>");
            res.write("<p>สภาพอากาศในตอนนี้ "+weatherData.weather[0].description+"</p>");
            res.write("<img src="+imgURL+" >");
            res.send();
        });

    });
})

app.listen(3000, ()=>{
    console.log ("Server is running on port 3000");
});

