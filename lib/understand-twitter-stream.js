function FriendsEvent() {
    var pub = {};

    pub.transform = function(originalEvent) {
        return {
            'subject' : 'user',
            'event' : 'friends',
            'content': originalEvent
        };
    };

    pub.match = function(originalEvent, keys) {
        if (keys.length != 1) return false;
        if (originalEvent.hasOwnProperty('friends')) return true;
        return false;
    };

    return pub;
}

function DeleteEvent() {
    var pub = {};

    pub.transform = function(originalEvent) {
        return {
            'subject' : 'tweet',
            'event' : 'delete',
            'statusId': originalEvent.delete.status.id,
            'content' : originalEvent
        };
    };

    pub.match = function(originalEvent) {
        if (originalEvent.hasOwnProperty('delete')) return true;
        return false;
    };

    return pub;
}


exports.transform = function(twitterEvent) {

    var knownEvents = [new FriendsEvent(), new DeleteEvent() ];

    var keys = Object.keys(twitterEvent);

    for (var i = 0; i < knownEvents.length; i++) {
        if (knownEvents[i].match(twitterEvent, keys)) {
            return knownEvents[i].transform(twitterEvent);
        }
    }
};
