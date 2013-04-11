var express = require("express");
var app = express();
var request = require("request");
var Diffbot = require('diffbot').Diffbot

var diffbot = new Diffbot('a425f0fde637e1f7741e20c2cfdae71a')

app.get('/crawl', function (req, res){
	var siteToCrawl = req.query.site;
	request(siteToCrawl, function(err, response, body){
		res.setHeader('Content-Type', 'json');
		if (!err && response.statusCode == 200){
			diffbot.article({uri: siteToCrawl, html: true}, function(err, responseDiffbot) {
				if (err)
					console.log(err);
				var jsonResponse = JSON.stringify({"isHTML": "True", "rawHTML" : responseDiffbot.html});
				res.end(jsonResponse); 
			});
		} else{
			jsonResponse = JSON.stringify({"isHTML" : "False", "errorCode" : response.statusCode});
			res.end(jsonResponse);
		}
	});
});

app.listen(5000);