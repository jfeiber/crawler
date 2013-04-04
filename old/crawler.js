var nodeio = require("node.io");
exports.job = new nodeio.Job({
	input: false,
	run : function(){
		//var site = this.options.args[0];
		this.getHtml(site, function(err, $, data, headers) {
			this.options.response[0].writeHead(200, {"Content-Type" : "text/plain"});
			if (err){
				throw err;
			}
			console.log(data);
			this.options.response[0].write(data);
			this.options.response[0].end();
		});
	}
	}); 
