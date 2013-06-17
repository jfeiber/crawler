var request = require('request');

if (process.env.HOME == '/Users/jfeiber'){
	DB_SUPERVISOR_URL = 'http://127.0.0.1:5001/nextlinktocrawl'
} else{
	DB_SUPERVISOR_URL = 'http://someaddress:5001/nextlinktocrawl'
}

while (true){
	var linkToCrawl;
	var error = true;
	while(error){
		request(DB_SUPERVISOR_URL, function (err, response, body){
			if (err)
				console.log(err)
			var obj = JSON.parse(body);
			if (typeof obj['Error'] == 'undefined'){
				linkToCrawl = obj['Link'];
				error = false;
			}
		});
	}
	console.log(linkToCrawl);
}
