var nodeio = require("node.io");
exports.job = new nodeio.Job({
	input: false,
	run : function(){
		var site = this.options.args[0];
		this.getHtml(site, function(err, $, data, headers) {
			if (err){
				throw err;
			}
			this.emit(data);
		});
	}
	}); 
