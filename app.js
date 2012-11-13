var oauth = require('oauth-client'),
    nconf = require('nconf');

var twitterFeed = (function() {
    var pub = {};

    var body = {
        track: ''
    };

    var requestConfig = {};

    pub.setOAuthDetails = function(config) {
        requestConfig = {
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
    }

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
    }

    var handleChunk = function(chunk) {
        if (chunk && chunk.trim()) {
            console.log("Got new chunk: ");
            var data = JSON.parse(chunk);
            console.log(data.text);
        } else {
            console.log('.');
        }
    }

    pub.start = function(itemToTrack) {
        body.track = itemToTrack;
        startTwitterFeed();
    };

    function startTwitterFeed() {
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
}());

nconf.file({file: 'config.json'});
twitterFeed.setOAuthDetails(nconf.get('oauth'));

twitterFeed.start("agile");