twitter-harvester
==================

Simple [node.js](http://nodejs.org/) application to harvest tweets from twitter
using their [streaming API](https://dev.twitter.com/docs/streaming-apis),
archive them in [MongoDB](http://www.mongodb.org/display/DOCS/Home),
gather stats using [cube](http://square.github.com/cube/)
and show them using [cubism](square.github.com/cubism/).

## Config

In order to use the application provide a configuration file `config.json` with the following details:

```json
{
    "oauth": {
        "consumerKey"       : "",
        "consumerSecret"    : "",
        "accessTokenKey"    : "",
        "accessTokenSecret" : ""
    }
}
```

Other configuration options.

### Content-server port

```json
{
    "content": {
        "server": {
            "port": 8081
        }
    }
}
```

### Mongo database for cube

```json
{
    "mongo_cube": {
        "server": "localhost",
        "port": 27017,
        "database": "twitter_harvest_cube"
    }
}
```

### Mongo database for archiving

```json
{
    "mongo_harvest": {
        "server": "localhost",
        "port": 27017,
        "database": "twitter_harvest"
    }
}
```

## Command-line

`node harvest.js --server` to start the stat server or in a separate process `node stat-server.js`

`node harvest.js --topic={topic}` to capture tweets on a particular topic

`node harvest.js --user` to capture user's (based on the oauth details) timeline tweets