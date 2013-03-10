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
        if (originalEvent.hasOwnProperty('friends')) return true;
        return false;
    };

    return pub;
}

function DeleteTweetEvent() {
    var pub = {};

    pub.transform = function(originalEvent) {
        return {
            'subject' : 'tweet',
            'event' : 'deleted',
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


function PostTweetEvent() {
    var pub = {};

    pub.transform = function(originalEvent) {
        return {
            'subject' : 'tweet',
            'event' : 'posted',
            'statusId': originalEvent.id,
            'content' : originalEvent
        };
    };

    pub.match = function(originalEvent) {
        if (originalEvent.hasOwnProperty('id') &&
            originalEvent.hasOwnProperty('text') &&
            originalEvent.hasOwnProperty('user')
            ) return true;
        return false;
    };

    return pub;
}

function FavourTweetEvent() {
    var pub = {};

    pub.transform = function(originalEvent) {
        return {
            'subject' : 'tweet',
            'event' : 'favorite',
            'statusId': originalEvent.target_object.id,
            'content' : originalEvent
        };
    };

    pub.match = function(originalEvent) {
        if (originalEvent.hasOwnProperty('event') &&
            originalEvent.event == 'favorite' &&
            originalEvent.hasOwnProperty('target_object') &&
            originalEvent.target_object.hasOwnProperty('id')) return true;
        return false;
    };

    return pub;
}


exports.transform = function(twitterEvent) {

    var knownEvents = [
        new FriendsEvent(),
        new DeleteTweetEvent(),
        new PostTweetEvent(),
        new FavourTweetEvent()];

    var keys = Object.keys(twitterEvent);

    for (var i = 0; i < knownEvents.length; i++) {
        if (knownEvents[i].match(twitterEvent, keys)) {
            return knownEvents[i].transform(twitterEvent);
        }
    }
};
