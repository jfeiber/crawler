function start(route, handle){	
	var http = require("http");
	var url = require("url");

	function onRequest(request, response){
		var data = "";
		var pathname = url.parse(request.url).pathname;
		request.setEncoding("utf8");
		console.log("Request for " + pathname + " recieved");

		request.addListener("data", function (chunk){
			data += chunk;
		});
		request.addListener("end", function(){
			route(handle, pathname, response, data);
		});
		
	}

	http.createServer(onRequest).listen(5000);
}

exports.start = start;