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

var saveData = function(data, collectionName) {
    collectionName = collectionName || 'timeline';

    if (data.id) {
        data._id = data.id;
    }

    db.collection(collectionName, function(err, collection) {
        collection.save(data);
    });
};

var feed = new twitter(nconf.get('oauth'));
var emitter = cube.emitter("udp://localhost:1180");

db.open(function() {
//    feed.publicStream("agile", function (tweet) {
//        console.log("* Got tweet about agile");
//        console.log(tweet.text);
//    });
    feed.userStream( function(event) {

        if (event.event == 'posted' && event.subject == 'tweet') {
            process.stdout.write('+');
            saveData(event.content, "timeline");
            emitter.send({
                type: 'tweet',
                time: new Date(event.content.created_at),
                data: {
                    'from' : event.content.user.screen_name,
                    'reply' : event.content.in_reply_to_status_id !== null,
                    'source' : event.content.source,
                    'retweet' : event.content.hasOwnProperty('retweeted_status')
                }
            });
        } else {
            process.stdout.write(':');
            saveData(event, "meta");
            var emittedEvent = {
                type: 'meta',
                time: new Date(),
                data: {
                    event: event.event
                }
            };

            if (event.hasOwnProperty('subject')) {
                emittedEvent.data.subject = event.subject;
            }

            emitter.send(emittedEvent);
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