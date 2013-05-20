var express = require("express");
var app = express();
var request = require("request");
var Diffbot = require('diffbot').Diffbot;
var pg = require('pg').native;
var cheerio = require('cheerio');
var url = require('url');

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
				$ = cheerio.load(responseDiffbot.html);
				var links = new Array();
				var i = 0;
				$('a').each(function(){
					if (links.indexOf($(this).attr('href')) == -1){
						links[i] = $(this).attr('href');
						i++;
					}
				}); 
				res.end(JSON.stringify({"isHTML": "True", "rawHTML" : responseDiffbot.html, "links" : links}));
			});
		} else{
			res.end(JSON.stringify({"isHTML" : "False", "errorCode" : response.statusCode}));
		}
	});
});

// pg.connect(DATABASE_URL, function (err, client){
// 	if (err) throw err;
// 	var domain = url.parse(siteToCrawl).hostname;
// 	if (domain.indexOf('www.') == 0){
// 		domain = domain.substring(4);
// 	}
// 	client.query('INSERT INTO crawldata (url, html) VALUES (\''+siteToCrawl+'\', \''+escape(responseDiffbot.html)+'\');');
// 	client.query('SELECT * FROM linktimetable where domain = \''+ domain + '\';', function(err, result){
// 		var date = new Date();
// 		timestamp = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
// 		if (result.rows.length == 0){
// 		    client.query('INSERT INTO linktimetable (domain, lastcrawled) VALUES (\''+domain+'\', \''+timestamp+'\');');
// 		} else {
// 			client.query('UPDATE linktimetable SET lastcrawled = \''+timestamp+'\' WHERE domain = \''+domain+'\';');
// 		}
// 	});
// });

// var link = $(this).attr('href');
// var domain = url.parse(link).hostname;
// if (domain.indexOf('www.') == 0){
// 	domain = domain.substring(4);
// }
// pg.connect(DATABASE_URL, function (err, client){
// 	if (err) throw err;
// 	client.query('SELECT * FROM linkstocrawl where fullurl = \''+ link + '\';', function(err, result){
// 		if (result.rows.length == 0){
// 		    client.query('INSERT INTO linkstocrawl (fullurl, domain) VALUES (\''+link+'\', \''+domain+'\');');
// 		} 
// 	});
// });


var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});