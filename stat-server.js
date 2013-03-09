var cube = require("cube");

var collectorOptions = {
    "mongo-host":"127.0.0.1",
    "mongo-port":27017,
    "mongo-database":"twitter_harvest_cube",
    "mongo-username":null,
    "mongo-password":null,
    "http-port" : 1080,
    "udp-port":1180
};

var evaluatorOptions = {
    "mongo-host":"127.0.0.1",
    "mongo-port":27017,
    "mongo-database":"twitter_harvest_cube",
    "mongo-username":null,
    "mongo-password":null,
    "http-port":1081
};

var registerServer = function (options, cubeSubject) {
    var server = cube.server(options);
    server.register = function (db, endpoints) {
        cubeSubject.register(db, endpoints);
    }

    server.start();
};

registerServer(collectorOptions, cube.collector);
registerServer(evaluatorOptions, cube.evaluator);