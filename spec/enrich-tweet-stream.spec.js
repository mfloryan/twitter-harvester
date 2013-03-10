var twitterEvents = require('../lib/understand-twitter-stream');

describe("Enrich twitter events", function() {
    it("can enrich friends list event", function() {
        var data = { "friends" : [
            370844675,
            100308547,
            78789634,
            94820552,
            531527413 ] };

        var event = twitterEvents.transform(data);

        expect(event.content).toBe(data);
        expect(event.event).toBe('friends');
        expect(event.subject).toBe('user');
    });

    it ("can enrich delete event", function() {
        var data = { "delete":
            { "status": {
                "id":3.105417376742851e+17,
                "user_id":14374075,
                "id_str":"310541737674285056",
                "user_id_str":"14374075" }
            }
        };

        var event = twitterEvents.transform(data);

        expect(event.content).toBe(data);
        expect(event.subject).toBe('tweet');
        expect(event.event).toBe('delete');
        expect(event.statusId).toBe(data.delete.status.id);
    })
});
