var express = require("express");
var app = express();
var pg = require('pg').native;

DATABASE_URL = 'postgres://yvjcpskpyvougu:AAjg7EhphZtmcLAJ2UQgYrtaiX@ec2-54-243-224-162.compute-1.amazonaws.com:5432/dchofrh486l0gi';
app.use(express.logger());

app.get('/nextlinktocrawl', function(req,res){
	res.setHeader('Content-Type', 'json');
	pg.connect(DATABASE_URL, function(err, client){
	if (err) throw err;
		var query = client.query("SELECT domain FROM linktimetable WHERE age(localtimestamp, lastcrawled) >= interval '1 minute';", function(err, result){
			if (err){
				console.log(err);
			}
			if (result.rows.length == 0){
				res.end(JSON.stringify({"Error" : "All links are in the 1 minute cooldown period, or there are no links."}));
			}
			var links = new Array();
			for (var i=0; i<result.rows.length; i++){
				links.push(result.rows[i]['domain'])
			}
			domain = links[Math.floor(Math.random()*links.length)];

			var query = client.query('SELECT * FROM linkstocrawl WHERE domain=\''+domain+'\';', function(err, result){
				if (err){
					console.log(err);
				}
				if (result.rows.length == 0){
					res.end(JSON.stringify({"Error" : "No links found for the desired domain."}));
				}
				var urls = new Array();
				for (var i=0; i<result.rows.length; i++){
					urls.push(result.rows[i]['fullurl']);
				}
				res.end(JSON.stringify({"Link" : urls[Math.floor(Math.random()*links.length)]}));
			});
		});
	});
});

var port = process.env.PORT || 5002;
app.listen(port, function() {
  console.log("Listening on " + port);
});