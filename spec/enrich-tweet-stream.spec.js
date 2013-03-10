var twitterEvents = require('../lib/understand-twitter-stream');

describe("Enrich twitter events", function() {
    it("when the event is friends list", function() {
        var data = { "friends" : [
            370844675,
            100308547,
            78789634,
            94820552,
            531527413 ] };

        var event = twitterEvents.transform(data);

        expect(event.content).toBe(data);
        expect(event.type).toBe('friends');
        expect(event.category).toBe('user');
    });
});
