var mongo = require('mongodb'),
    nconf = require('nconf'),
    twitter = require('./twitter-stream'),
    cube = require('cube');

require('./stat-server');

nconf.file({file: 'config.json'});

nconf.defaults({
    mongo: {
        server: 'localhost',
        port: 27017,
        database: 'twitter-harvest'
    }
});

var db = (function() {
    var server = new mongo.Server(
        nconf.get('mongo:server'),
        nconf.get('mongo:port'),
        {auto_reconnect: true});
    return new mongo.Db(nconf.get('mongo:database'), server, {safe:true});
})();

var saveTweet = function(tweet, collectionName) {
    collectionName = collectionName || 'tweets';
    if (tweet.id) {
        tweet._id = tweet.id;
    }
    db.collection(collectionName, function(err, collection) {
        collection.save(tweet);
    });
};

var feed = new twitter(nconf.get('oauth'));
var emitter = cube.emitter("udp://localhost:1180");

db.open(function() {
//    feed.publicStream("agile", function (tweet) {
//        console.log("* Got tweet about agile");
//        console.log(tweet.text);
//    });
    feed.userStream( function(tweet) {
        var keys = Object.keys(tweet);
        if (keys.length > 1) {
            saveTweet(tweet, "timeline");
            emitter.send({
                type: 'tweet',
                time: new Date(tweet.created_at),
                data: {
                    'from' : tweet.user.screen_name,
                    'reply' : tweet.in_reply_to_status_id !== undefined,
                    'source' : tweet.source
                }
            });
        } else {
            saveTweet(tweet, "meta");
            emitter.send({
                type: "meta",
                time: new Date(),
                data: {
                    type: keys[0]
                }
            });
        }
    });
});

process.on('SIGINT', function() {
    console.log('Cleaning-up!');
    emitter.close();
    db.close();
    console.log('Goodbye.');
    process.exit();
});