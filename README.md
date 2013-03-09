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