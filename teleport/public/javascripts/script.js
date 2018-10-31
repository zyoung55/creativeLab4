/*
global $ 
*/

$(document).ready(function() {
    
    console.log("YEAH!");
    
    $("#userForm").submit(function(e) {
        e.preventDefault();
        
        //user?name=tom&age=55
        
        var cityString = $('#userCity').val();
        var splitString = cityString.split('');
        console.log(splitString);
        
        for (var i = 0; i < splitString.length; ++i) {
            console.log(splitString[i]);
            if (splitString[i] == " ") {
                console.log("Yeahahah");
                splitString.splice(i, 1, '-');
            }
        }
        cityString = splitString.join('');
        console.log("City String" + splitString);
        
        
        var cityUrl = "cityInfo?";
        //var query = "gender=" + $('#gender').val() + "&" + "username=" + $('#userName').val() + "&" + "city=" + $('#userCity').val();
        var query = "gender=" + $('#gender').val() + "&" + "username=" + $('#userName').val() + "&" + "city=" + cityString;
        cityUrl += query;
        console.log("CityUrl" + cityUrl);
        
        var cityData = {"continent" : "", "fullName" : "", "pictureURL" : "", "mobileURL" : ""
        };
        
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
            console.log(cityData);
            console.log(data);
            console.log(cityData["pictureURL"]);
            
            /*Get the url for the cities picture to display. */
            $.getJSON(cityData["pictureURL"], function(data){
                cityData["mobileURL"] = data.photos[0]["image"]["mobile"];
                console.log("mobileImage:", cityData["mobileURL"]);
                console.log('<img src="' + cityData["mobileURL"] + '">');
                
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