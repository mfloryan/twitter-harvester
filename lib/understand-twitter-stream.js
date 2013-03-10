function FriendsEvent() {
    var pub = {};

    pub.transform = function(originalEvent) {
        return {
            'category' : 'user',
            'type' : 'friends',
            'content': originalEvent
        };
    };

    return pub;
}


exports.transform = function(twitterEvent) {
    var friendsEventProcessor = new FriendsEvent();
    return friendsEventProcessor.transform(twitterEvent);
};
