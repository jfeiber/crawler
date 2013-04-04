function route(handle, path, response, data){
	console.log("Routing request for " + path);
	if (typeof handle[path] === 'function'){
		handle[path](response, data);
	}
	else{
		console.log("Request handler not found for " + path);
		response.writeHead(404, {"Content-Type" : "text/plain"});
		response.write("404");
		response.end();
	}
}

exports.route = route;