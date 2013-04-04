var express = require("express");
var app = express();
var request = require("request");

app.get('/crawl', function (req, res){
	request(req.query.site, function (err, response, body){
		res.setHeader('Content-Type', 'json');
		if (!err && response.statusCode == 200){
			var jsonResponse = JSON.stringify({"isHTML": "True", "rawHTML" : body}); 
		}
		else{
			var jsonResponse = JSON.stringify({"isHTML" : "False", "errorCode" : response.statusCode});
		}
		res.end(jsonResponse);
	});
});

app.listen(5000);