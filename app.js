var express = require("express");
var app = express();
var request = require("request");
var Diffbot = require('diffbot').Diffbot;
var pg = require('pg').native;

DATABASE_URL = 'postgres://yvjcpskpyvougu:AAjg7EhphZtmcLAJ2UQgYrtaiX@ec2-54-243-224-162.compute-1.amazonaws.com:5432/dchofrh486l0gi';

app.use(express.logger());

var diffbot = new Diffbot('a425f0fde637e1f7741e20c2cfdae71a');

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
		res.end(JSON.stringify({"isHTML": "False", "errorCode" : "Make you have http:// or https:// at the beginning of the URL you wish to crawl."}));
	}
	request(siteToCrawl, function(err, response, body){
		if (err){
			res.end(JSON.stringify({"isHTML" : "False", "errorCode" : '400'}));
		} else if (response.statusCode == 200){
			diffbot.article({uri: siteToCrawl, html: true}, function(err, responseDiffbot) {
				res.end(JSON.stringify({"isHTML": "True", "rawHTML" : responseDiffbot.html}));
				pg.connect(DATABASE_URL, function (err, client){
					if (err) throw err;
					var query = client.query('INSERT INTO crawldata (url, html) VALUES (\''+siteToCrawl+'\', \''+escape(responseDiffbot.html)+'\');');
				}); 
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