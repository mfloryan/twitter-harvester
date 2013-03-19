var cube = require("cube"),
    connect = require("connect"),
    nconf = require('nconf');

nconf.file({file: 'config.json'});

nconf.defaults({
    content: {
        server: {
            port: 8081
        }
    },
    mongo_cube: {
        server: 'localhost',
        port: 27017,
        database: 'twitter_harvest_cube'
    }
});

var collectorOptions = {
    "mongo-host":nconf.get('mongo_cube:server'),
    "mongo-port":nconf.get('mongo_cube:port'),
    "mongo-database":nconf.get('mongo_cube:database'),
    "mongo-username":null,
    "mongo-password":null,
    "http-port" : 1080,
    "udp-port":1180
};

var evaluatorOptions = {
    "mongo-host":nconf.get('mongo_cube:server'),
    "mongo-port":nconf.get('mongo_cube:port'),
    "mongo-database":nconf.get('mongo_cube:database'),
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

var serverPort = nconf.get('content:server:port');

connect.createServer(
    connect.static(__dirname + '/static')
).listen(serverPort);

console.log('Serving content on port: ' + serverPort);