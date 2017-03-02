window.$ = window.jQuery = require('jquery');
$("#btn-test").click(function(){
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
})

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
	    console.log(res.current_observation.feelslike_string)
	  });
	}
	http.request(options, callback).end();
}