/*
global $ 
*/

$(document).ready(function() {
    
    $.getJSON("updatedCityInfo", function(data) {
        $.getJSON("userInfo", function(userData) {
        console.log(data);
        
        var tempCitiesArray = [];
        
        /*This stores the information from data into the tempCitiesArray */
        for (var i = 0; i < data.length; ++i) {
            var receivedCityData = {'continent' : '', 'cityName' : '', 'pictureUrl' :'', 'mobileUrl' : '', "peopleTally" : ''};
            receivedCityData['continent'] = data[i]['continent'];
            receivedCityData['cityName'] = data[i]['cityName'];
            receivedCityData['pictureUrl'] = data[i]['pictureUrl'];
            receivedCityData['mobileUrl'] = data[i]['mobileUrl'];
            receivedCityData['peopleTally'] = data[i]['peopleTally'];
            tempCitiesArray.push(receivedCityData);
            console.log(tempCitiesArray[i]);
        }
        
        /*This sorts the tempCitiesArray based on tally amount.*/
        var tempvalue = '';
        for (var i = 0; i < tempCitiesArray.length; ++i) {
            for (var j = 0; j < tempCitiesArray.length - i - 1; ++j) {
                if (tempCitiesArray[j]["peopleTally"] < tempCitiesArray[j + 1]["peopleTally"]) {
                    tempvalue = tempCitiesArray[j];
                    tempCitiesArray[j] = tempCitiesArray[j + 1];
                    tempCitiesArray[j + 1] = tempvalue;
                }
            }
        }
        
        /*This for-loop adds new city data to the page*/
        for (var i = 0; i < tempCitiesArray.length; ++i) {
            var newDiv = $('<div class="cityDivs"></div>')
            $("#containerDiv").append(newDiv);
            if (i == 0) {
                var numberOneMessage = $("<h3>Number One City!</h3>");
                numberOneMessage.css({"color" : "#FFE033"})
                newDiv.append(numberOneMessage);
            }
            if (i == 1) {
                var numberTwoMessage = $('<h3>Number Two City!</h3>');
                numberTwoMessage.css({"color" : "#C9C9AF"});
                newDiv.append(numberTwoMessage);
            }
            if (i == 2) {
                var numberThreeMessage = $('<h3>Number Three City!</h3>');
                numberThreeMessage.css({"color": "#E8B664"})
                newDiv.append(numberThreeMessage);
            }
                
            var cityNameElement = $("<h3>" + tempCitiesArray[i]["cityName"].replace(/-/g, ' ') + "</h3>");
            newDiv.append(cityNameElement);
                
            var pictureElement = $('<img class="img-fluid" src="' + tempCitiesArray[i]["mobileUrl"] + '">');
            newDiv.append(pictureElement);
                
            var continentElement = $("<h4>Continent: " + tempCitiesArray[i]["continent"] + "</h4>");
            newDiv.append(continentElement);
            
            var currentMembers = $("<h4>Current users from city: " + tempCitiesArray[i]['peopleTally'] + "</h4>");
            newDiv.append(currentMembers);
            
            var userIcons = $("<div class = 'userIconsDiv'></div>");
            newDiv.append(userIcons);
            
            for (var j = 0; j < userData.length; ++j) {
                //console.log(userData[j]);
                //console.log("Current city name:" + tempCitiesArray[i]["cityName"] + " " + userData[j]['cityName']);
                if (tempCitiesArray[i]['cityName'] == userData[j]['userCity']) {
                    var userDiv = $('<div class="userDisplayClass"></div>');
                    var personImage = $('<img class="iconImageClass" src="' + userData[j]['pictureUrl'] + '">');
                    //personImage.css({"width" : "7%"});
                    userDiv.append(personImage);
                    
                    var userName = $('<h6>' + userData[j]['username'] + '</h6>');
                    console.log("userName" + userData[j]['username']);
                    //userName.css({"width" : "7%"});
                    userDiv.append(userName);
                    //newDiv.append(userDiv);
                    userIcons.append(userDiv);
                    
                    console.log(userData[j]);
                }
            }
        }
        })
    })
    
    console.log("YEAH!");
    
    $("#userForm").submit(function(e) {
        e.preventDefault();
        
        /*Checks to make sure all input was selected. */
        if ($("#gender").val() == '' || $('#userName').val() == '' || $('#userCity').val() == '') {
            alert("You did not enter information into at least one of the data fields. Please reenter your information.");
            $("#gender").val('');
            $('#userName').val('');
            $('#userCity').val('');
            return;
        }
        
        /*var userName = $('#userName').val('');
        
        for (var i = 0; i < userName.length; ++i) {
            if (!userName[i].match(/[a-z]/)) {
                alert("An custom icon couldn't be created for your name. Please try again with a new input.")
                return;
            }
        }*/
        
        /*This section of code changes user input for city name to a format that can be used in a query.*/
        var initialString = $('#userCity').val()
        var cityString = initialString.toLowerCase();
        var splitString = cityString.split('');
        for (var i = 0; i < splitString.length; ++i) {
            console.log(splitString[i]);
            if (splitString[i] == " ") {
                splitString.splice(i, 1, '-');
            }
        }
        cityString = splitString.join('');
    
        var avatarUrl = "https://avatars.dicebear.com/v2" + "/" + $('#gender').val() + "/" + $('#userName').val() + ".svg";
        console.log(avatarUrl);
    
        var userUrl = "userInfo";
        var userData = {"gender" : $('#gender').val(), "username" : $('#userName').val(), "customIcon" : avatarUrl, "userCity" : cityString};
        
        /*This adds the data to the /userInfo route*/
        $.post(userUrl, userData, function(data) {})
        
        var cityUrl = "cityInfo?";
        var query = "gender=" + $('#gender').val() + "&" + "username=" + $('#userName').val() + "&" + "city=" + cityString;
        cityUrl += query;
        
        var cityData = {"continent" : "", "fullName" : "", "pictureURL" : "", "mobileURL" : ""};
        
        /*Get the original data for the city.*/
        $.getJSON(cityUrl, function() {})
        .error(function() { 
            var alertString = "There was an issue with the city for which you were searching.\n"; 
            alertString += "Please try again with a large city/country close to the one you originally tried.";
            alert(alertString)
            $('#userName').val('');
            $('#userCity').val('');
        })
        .success(function(data) {
            cityData["continent"] = data.continent;
            cityData["fullName"] = data.full_name;
            cityData["pictureURL"] = data["_links"]["ua:images"]["href"];
            $.getJSON(cityData["pictureURL"], function(data){
                cityData["mobileURL"] = data.photos[0]["image"]["mobile"];
                
                
                var updatedCityUrl = "updatedCityInfo";
                var updatedData = {"continent" : cityData["continent"], "cityName" : cityString, "pictureUrl" : cityData["pictureURL"], "mobileUrl" :  cityData["mobileURL"]}; 
                $.post(updatedCityUrl, updatedData, function(data) {
                    if (data) {
                        console.log("DATA:!!!" + data);
                        var newDiv = $('<div id="' +  $('#userCity').val() + '"></div>')
                        $("#containerDiv").append(newDiv);
                
                        var cityNameElement = $("<h3>" + cityData["fullName"] + "</h3>");
                        newDiv.append(cityNameElement);
                
                        var pictureElement = $('<img class="cityImageClass" src="' + cityData["mobileURL"] + '">');
                        newDiv.append(pictureElement);
                
                        var continentElement = $("<h4>Continent: " + cityData["continent"] + "</h4>");
                        newDiv.append(continentElement);
                        
                        var currentMembers = $("<h4>Current users from city: " + 1 + "</h4>");
                        newDiv.append(currentMembers);
                
                        newDiv.css({"text-align" : "center"});
                        $('#userName').val('');
                        $('#userCity').val('');
                        window.location.reload(true);
                        //$("#userForm").remove();
                    }
                    else {
                        $('#userName').val('');
                        $('#userCity').val('');
                        window.location.reload(true);
                    }
                });
            })
        })
        console.log("it worked!");
    })
    
})