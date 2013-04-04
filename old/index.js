var server = require("./server");
var router = require("./route");
var requestHandlers = require("./requestHandlers");

var handle = {};
handle["/crawl"] = requestHandlers.crawl;

server.start(router.route, handle);