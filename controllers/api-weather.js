// REQUIRED PACKAGES
const axios = require("axios");
const db = require("../models");
var express = require("express");
var router = express.Router();




// YELP FUSION API CALL
router.get("/api/weather", (req, res) => {

  var apiKey   = process.env.OPEN_WEATHER_API_KEY;
    endPoint = 'https://api.openweathermap.org/data/2.5/weather?q=Sydney,Australia&units=metric&appid=' + apiKey;


  axios
  .get(endPoint)
  .then(function(result) {
    
    let data = {
      info: result.data.weather[0].main,
      detailed: result.data.weather[0].description,
      icon: result.data.weather[0].icon,
      temp: result.data.main.temp
    }

    res.json(data);

  })
  .catch((e) => {
    console.log(e);
  });
  
    
  

  //res.json
});

// EXPORT FUNCTION
module.exports = router;
