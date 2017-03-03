window.$ = window.jQuery = require('jquery');
require('electron').ipcRenderer.on('ping',function(event, message){initiateQuery()});
function initiateQuery(){
	var https = require('https');
	var options = {
	  host: 'www.googleapis.com',
	  path: '/geolocation/v1/geolocate?key=AIzaSyAgfxoymhJk89sCQwiJwjjJLgQ9Sgz6g18',
	  method: 'POST'
	};

	callback = function(response) {
	  var str = ''
	  response.on('data', function (chunk) {
	    str += chunk;
	  });

	  response.on('end', function () {
	    console.log(str);
	    coor = JSON.parse(str);
		getStateCity(coor.location.lat, coor.location.lng);
	  });
	}
	var req = https.request(options, callback);
	//This is the data we are posting, it needs to be a string or a buffer
	req.write("hello world!");
	req.end();
}

function getStateCity(lat, lng) {
	var http = require('http');

	//The url we want is: 'www.random.org/integers/?num=1&min=1&max=10&col=1&base=10&format=plain&rnd=new'
	var options = {
	  host: 'api.wunderground.com',
	  path: '/api/c687960abbb59768/geolookup/q/'+lat+','+lng+'.json'
	};

	callback = function(response) {
	  var str = '';
	  response.on('data', function (chunk) {
	    str += chunk;
	  });
	  response.on('end', function () {
	  	obj = JSON.parse(str);
	    getWeather(obj.location.state, obj.location.city.split(' ').join('_'))
	  });
	}

	http.request(options, callback).end();
}

function getWeather(state, city) {
	var http = require('http');
	var options = {
	  host: 'api.wunderground.com',
	  path: '/api/c687960abbb59768/conditions/q/'+state+'/'+city+'.json'
	};

	callback = function(response) {
	  var str = '';
	  response.on('data', function (chunk) {
	    str += chunk;
	  });
	  response.on('end', function () {
	    res = JSON.parse(str);
	    //console.log(res.current_observation.feelslike_string)
	    showBackground(res.current_observation.local_time_rfc822,res.current_observation.weather)
	    showInfo(res.current_observation.display_location.full, res.current_observation.feelslike_string, res.current_observation.wind_mph)
	  });
	}
	http.request(options, callback).end();
}
function showInfo(city, temp, wind) {
	$("#city").html(city);
	$("#feelslike").html(temp);
	$("#wind").html(wind);
}
function showBackground(time, weather) {
	var hour = time.split(":")[0].slice(-2);
	var dn;
	if(hour > 6 && hour < 18) 
		dn = "day";
	else	dn = "night";
	console.log(weather);
	console.log(hour);
	console.log(dn);
	if(weather.includes("Rain"))
		$("body").css('background-image', 'url("img/rainny.jpg")');
	else if(weather.includes("Cloud"))
		$("body").css('background-image', 'url("img/cloudy.jpg")');
	else{
		if(dn == "night")
			$("body").css('background-image', 'url("img/clearnight.jpg")');
		else
			$("body").css('background-image', 'url("img/sunnyday.jpg")');
	}
}