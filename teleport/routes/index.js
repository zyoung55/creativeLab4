var express = require('express');
var router = express.Router();
var request = require('request');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile('index.html', { title: 'public' });
});

router.get('/cityInfo', function(req, res, next) {
    console.log("In cityInfo " + "Request Data: " + req.query.gender);
    console.log("Gender: " + req.query.gender);
    console.log("Username" + req.query.username);
    console.log("City" + req.query.city);
    var receivedCity = req.query.city;
    var lowerCaseCity = receivedCity.toLowerCase();
    console.log("Lower Case City: " + lowerCaseCity);
    var teleportUrl = "https://api.teleport.org/api/urban_areas/slug:";
    teleportUrl += lowerCaseCity + "/";
    console.log(teleportUrl);
    //var cityid = [];
    request(teleportUrl).pipe(res);
    
})

module.exports = router;
