/*
global $ 
*/

$(document).ready(function() {
   
    console.log("YEAH!");
    
    $("#userForm").submit(function(e) {
        e.preventDefault();
        
        var cityString = $('#userCity').val();
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
        
        /*Error checking for the request for city data.*/
        .error(function() { 
            var alertString = "There was an issue with the city for which you were searching.\n"; 
            alertString += "Please try again with a large city/country close to the one you originally tried.";
            alert(alertString)
            $('#userName').val('');
            $('#userCity').val('');
        })
        
        /*If successful, put the data into the html.*/
        .success(function(data) {
            cityData["continent"] = data.continent;
            cityData["fullName"] = data.full_name;
            cityData["pictureURL"] = data["_links"]["ua:images"]["href"];
            
            /*Get the url for the cities picture to display. */
            $.getJSON(cityData["pictureURL"], function(data){
                cityData["mobileURL"] = data.photos[0]["image"]["mobile"];
                
                
                var updatedCityUrl = "updatedCityInfo";
                var updatedData = {"continent" : cityData["continent"], "cityName" : cityString, "pictureUrl" : cityData["pictureURL"], "mobileUrl" :  cityData["mobileURL"]}; 
                $.post(updatedCityUrl, updatedData, function(data) {});
                
                var newDiv = $('<div id="' +  $('#userCity').val() + '"></div>')
                $("#containerDiv").append(newDiv);
                
                var cityNameElement = $("<h3>" + cityData["fullName"] + "</h3>");
                newDiv.append(cityNameElement);
                
                var pictureElement = $('<img src="' + cityData["mobileURL"] + '">');
                newDiv.append(pictureElement);
                
                var continentElement = $("<h4>Continent: " + cityData["continent"] + "</h4>");
                newDiv.append(continentElement);
                
                newDiv.css({"text-align" : "center"});
                $('#userName').val('');
                $('#userCity').val('');
            })
        })
        console.log("it worked!");
    })
    
})