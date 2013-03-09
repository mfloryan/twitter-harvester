function twitterStream(config) {

    var pub = {};

    var requestConfig = {
        port: 443,
        https: true,
        oauth_signature: (function(){
            var consumer = oauth.createConsumer(config.consumerKey, config.consumerSecret);
            var token = oauth.createToken(config.accessTokenKey, config.accessTokenSecret);
            return oauth.createHmac(consumer, token)
        }()),
        method: 'POST'
    };

    var body;

    var tweetCallback;

    var errorCounter = 0;

    var handleError = function(error) {
        errorCounter++;
        console.log("Got an error: " + error);
        if (errorCounter < 5) {
            console.log("Will try again soon");
            setTimeout(startTwitterFeed, 10000 * errorCounter);
        } else {
            console.log("Sorry. Too many errors. Bye!")
        }
    };

    var handleChunk = function(chunk) {
        if (chunk && chunk.trim()) {
            var data = JSON.parse(chunk);
            if (data && tweetCallback) tweetCallback(data);
        } else {
            console.log('.');
        }
    };

    pub.publicStream = function(itemToTrack, itemCallback) {
        requestConfig.host = 'stream.twitter.com';
        requestConfig.path = '/1.1/statuses/filter.json';
        body = { "track" : itemToTrack };
        tweetCallback = itemCallback;
        startTwitterFeed();
    };

    pub.userStream = function(itemCallback) {
        requestConfig.host = 'userstream.twitter.com';
        requestConfig.path = '/1.1/user.json';
        body = { "with" : "followings" };
        tweetCallback = itemCallback;
        startTwitterFeed();
    }

    function startTwitterFeed() {
        console.log("Connecting...");
        console.log(requestConfig);
        requestConfig.body = body;
        var request = oauth.request(requestConfig, function(response) {
            console.log("Here is my response code: "+ response.statusCode);
            console.log("Now waiting for some interesting Twitter data");
            console.log();
            response.setEncoding('utf8');
            response.on('data', handleChunk);
        });

        request.write(body);
        request.end();
        request.on('error', handleError);
    }

    return pub;
}

var oauth = require('oauth-client');

module.exports = twitterStream;