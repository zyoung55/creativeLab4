var express = require('express');
var router = express.Router();
var request = require('request');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile('index.html', { title: 'public' });
});

var cityInfo = [];

var userInfo = [];

router.get('/cityInfo', function(req, res, next) {
    console.log("In cityInfo " + "Request Data: " + req.query.gender);
    var receivedCity = req.query.city;
    var lowerCaseCity = receivedCity.toLowerCase();
    var teleportUrl = "https://api.teleport.org/api/urban_areas/slug:";
    teleportUrl += lowerCaseCity + "/";
    request(teleportUrl).pipe(res);
})

router.post('/userInfo', function(req, res) {
  console.log("In user Info");
  var user = {"gender" : "", "username" : "", "pictureUrl" : ""};
  user['gender'] = req.body.gender;
  user['username'] = req.body.username;
  user['pictureUrl'] = req.body.customIcon;
  user['userCity'] = req.body.userCity;
  userInfo.push(user);
  res.send(userInfo);
  res.end('{"success" : "Updated Successfully", "status" : 200}');
})

router.get('/userInfo', function(req, res){
  res.send(userInfo)
})

router.post('/updatedCityInfo', function(req, res) {
  console.log("req body: " + req.body.cityName);
  for (var i = 0; i < cityInfo.length; ++i) {
    if (cityInfo[i]['cityName'] == req.body.cityName) {
      ++cityInfo[i]['peopleTally'];
      console.log("cityName: " + cityInfo[i]['cityName']);
      console.log("peopleTally: " + cityInfo[i]['peopleTally']);
      res.send(false);
      return;
    }
  }
  console.log("made it here!");
  console.log("Data:" + req.body.continent);
  var city = {'continent' : '', 'cityName' : '', 'pictureUrl' :'', 'mobileUrl' : '', "peopleTally" : 1};
  city['continent'] = req.body.continent;
  city['cityName'] = req.body.cityName;
  city['pictureUrl'] = req.body.pictureUrl;
  city['mobileUrl'] = req.body.mobileUrl;
  cityInfo.push(city);
  res.send(true);
})

router.get('/updatedCityInfo', function(req, res, next) {
  res.send(cityInfo);
})

module.exports = router;