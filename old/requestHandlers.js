var nodeio = require("node.io")
var exec = require("child_process").exec;
var request = require("request");
var crawler = require("./crawler.js")

function crawl(response, data){
	console.log("Crawl request handler reporting for duty. Crawling " + data);
	response.writeHead(200, {"Content-Type" : "JSON"});
	request(data, function (error, res, body){
		if (res.statusCode != 200){
			response.write(JSON.stringify({isHTML : "False", errorCode : res.statusCode}));
			response.end();
		}
		else{
			// exec("node.io crawler.js " + data, function (error, stdout, stderr){
			// if (error){
			// 	throw error;
			// }
			// response.write(JSON.stringify({isHTML : "True", rawHTML : stdout}));
			// response.end();
			// });
			var options = {
				response : response,
			}
			nodeio.start(crawler, options, function (err, output){
				response.write(String(output));
				response.end();
			}, true);
		}
	});
	// nodeio.start(test, function (err, output){
	// 	response.write(String(output));
	// 	response.end();
	// }, true);
}

exports.crawl = crawl;