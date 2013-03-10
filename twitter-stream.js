function twitterStream(config) {

    var pub = {};

    var buildRequestSkeleton = function() {
        return {
            port: 443,
            https: true,
            oauth_signature: (function(){
                var consumer = oauth.createConsumer(config.consumerKey, config.consumerSecret);
                var token = oauth.createToken(config.accessTokenKey, config.accessTokenSecret);
                return oauth.createHmac(consumer, token)
            }()),
            method: 'POST'
        }
    };

    var errorCounter = 0;

    var handleError = function(error, request, body, callback) {
        errorCounter++;
        console.log("Got an error: " + error);
        if (errorCounter < 5) {
            console.log("Will try again soon");
            setTimeout(startTwitterFeed, 10000 * errorCounter, request, body, callback);
        } else {
            console.log("Sorry. Too many errors. Bye!")
        }
    };

    var provideChunkHandlerFor = function(callback) {
        return function(chunk) {
            if (chunk && chunk.trim()) {
                var data = JSON.parse(chunk);
                try {
                    if (data && callback) callback(data);
                } catch (e) {
                    console.log(e);
                }
            } else {
                process.stdout.write('.');
            }
        }
    };

    pub.publicStream = function(itemToTrack, itemCallback) {
        var body = { "track" : itemToTrack };
        var request = buildRequestSkeleton();
        request.host = 'stream.twitter.com';
        request.path = '/1.1/statuses/filter.json';
        request.body = body;
        startTwitterFeed(request, body, itemCallback);
    };

    pub.userStream = function(itemCallback) {
        var body = { "with" : "followings" };
        var request = buildRequestSkeleton();
        request.host = 'userstream.twitter.com';
        request.path = '/1.1/user.json';
        request.body = body;
        startTwitterFeed(request, body, itemCallback);
    };

    function startTwitterFeed(request, body, callback) {
        console.log("Connecting...");
        var request = oauth.request(request, function(response) {
            console.log("Here is my response code: "+ response.statusCode);
            console.log("Now waiting for some interesting Twitter data");
            console.log();
            response.setEncoding('utf8');
            response.on('data', provideChunkHandlerFor(callback));
        });

        request.write(body);
        request.end();
        request.on('error', function (error) {
            handleError(error, request, body, callback);
        });
    }

    return pub;
}

var oauth = require('oauth-client');

module.exports = twitterStream;