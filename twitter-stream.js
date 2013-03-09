function twitterStream(config) {

    var pub = {};

    var body = {
        track: ''
    };

    var requestConfig = {
        port: 443,
        host: 'stream.twitter.com',
        https: true,
        path: '/1.1/statuses/filter.json',
        oauth_signature: (function(){
            var consumer = oauth.createConsumer(config.consumerKey, config.consumerSecret);
            var token = oauth.createToken(config.accessTokenKey, config.accessTokenSecret);
            return oauth.createHmac(consumer, token)
        }()),
        method: 'POST',
        body : body
    }

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

    pub.start = function(itemToTrack, itemCallback) {
        body.track = itemToTrack;
        tweetCallback = itemCallback;
        startTwitterFeed();
    };

    function startTwitterFeed() {
        console.log("Connecting...");
        console.log(requestConfig);
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