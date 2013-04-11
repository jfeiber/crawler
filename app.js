var express = require("express");
var app = express();
var request = require("request");
var Diffbot = require('diffbot').Diffbot

app.use(express.logger());

var diffbot = new Diffbot('a425f0fde637e1f7741e20c2cfdae71a')

app.get('/', function (req, res){
	res.setHeader('Content-Type', 'json');
	res.end('Please go to /crawl to use the crawler');
});

app.get('/crawl', function (req, res){
	res.setHeader('Content-Type', 'json');
	var siteToCrawl = req.query.site;
	if (typeof siteToCrawl === 'undefined'){
		res.end(JSON.stringify({"isHTML": "False", "errorCode" : "Make sure you have the URL right. Example: http://xxx.com/crawl/?site=http://google.com"}));
	}
	if (siteToCrawl.indexOf("http") !== 0){
		res.end(JSON.stringify({"isHTML": "False", "rawHTML" : "Make you have http:// or https:// at the beginning of the URL you wish to crawl."}));
	}
	request(siteToCrawl, function(err, response, body){
		if (err){
			res.end(JSON.stringify({"isHTML" : "False", "errorCode" : '400'}));
		} else if (response.statusCode == 200){
			diffbot.article({uri: siteToCrawl, html: true}, function(err, responseDiffbot) {
				res.end(JSON.stringify({"isHTML": "True", "rawHTML" : responseDiffbot.html})); 
			});
		} else{
			res.end(JSON.stringify({"isHTML" : "False", "errorCode" : response.statusCode}));
		}
	});
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});