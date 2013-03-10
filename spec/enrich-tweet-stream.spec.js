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
        expect(event.event).toBe('deleted');
        expect(event.statusId).toBe(data.delete.status.id);
    });

    it ("can enrich tweet event", function() {
        var data = { "created_at" : "Sat Mar 09 23:14:14 +0000 2013",
            "id" : 3.105289860589937e+17,
            "id_str" : "310528986058993664",
            "text" : "Very thankful for this guide (albeit old, still worked) from @codyfauser http://t.co/XDw2zymndc",
            "source" : "<a href=\"http://itunes.apple.com/us/app/twitter/id409789998?mt=12\" rel=\"nofollow\">Twitter for Mac</a>",
            "truncated" : false,
            "in_reply_to_status_id" : null,
            "in_reply_to_status_id_str" : null,
            "in_reply_to_user_id" : null,
            "in_reply_to_user_id_str" : null,
            "in_reply_to_screen_name" : null,
            "user" : { "id" : 11458102,
                "id_str" : "11458102",
                "name" : "Corey Haines",
                "screen_name" : "coreyhaines",
                "location" : "Chicago, IL",
                "url" : "http://www.coreyhaines.com",
                "description" : "Aaron Patterson #emumarch",
                "protected" : false,
                "followers_count" : 9801,
                "friends_count" : 486,
                "listed_count" : 808,
                "created_at" : "Sun Dec 23 18:11:29 +0000 2007",
                "favourites_count" : 235,
                "utc_offset" : -21600,
                "time_zone" : "Central Time (US & Canada)",
                "geo_enabled" : false,
                "verified" : false,
                "statuses_count" : 58134,
                "lang" : "en",
                "contributors_enabled" : false,
                "is_translator" : false,
                "profile_background_color" : "C6E2EE",
                "profile_background_image_url" : "http://a0.twimg.com/images/themes/theme2/bg.gif",
                "profile_background_image_url_https" : "https://si0.twimg.com/images/themes/theme2/bg.gif",
                "profile_background_tile" : false,
                "profile_image_url" : "http://a0.twimg.com/profile_images/1508969901/Photo_on_2011-08-22_at_19.15__3_normal.jpg",
                "profile_image_url_https" : "https://si0.twimg.com/profile_images/1508969901/Photo_on_2011-08-22_at_19.15__3_normal.jpg",
                "profile_link_color" : "1F98C7",
                "profile_sidebar_border_color" : "C6E2EE",
                "profile_sidebar_fill_color" : "DAECF4",
                "profile_text_color" : "663B12",
                "profile_use_background_image" : true,
                "default_profile" : false,
                "default_profile_image" : false,
                "following" : null,
                "follow_request_sent" : null,
                "notifications" : null },
            "geo" : null,
            "coordinates" : null,
            "place" : null,
            "contributors" : null,
            "retweet_count" : 0,
            "entities" : { "hashtags" : [],
                "urls" : [
                    { "url" : "http://t.co/XDw2zymndc",
                        "expanded_url" : "http://www.codyfauser.com/2008/1/17/paypal-express-payments-with-activemerchant",
                        "display_url" : "codyfauser.com/2008/1/17/payp…",
                        "indices" : [
                            73,
                            95 ] } ],
                "user_mentions" : [
                    { "screen_name" : "codyfauser",
                        "name" : "Cody Fauser",
                        "id" : 14996079,
                        "id_str" : "14996079",
                        "indices" : [
                            61,
                            72 ] } ] },
            "favorited" : false,
            "retweeted" : false,
            "possibly_sensitive" : false,
            "filter_level" : "medium"};

        var event = twitterEvents.transform(data);

        expect(event.content).toBe(data);
        expect(event.subject).toBe('tweet');
        expect(event.event).toBe('posted');
        expect(event.statusId).toBe(data.id);
    });

    it ("can enrich explicit event", function() {
        var data = { "event" : "favorite",
            "created_at" : "Sun Mar 10 01:15:37 +0000 2013",
            "target" : { "profile_banner_url" : "https://twimg0-a.akamaihd.net/profile_banners/39249507/1348652087",
                "id" : 39249507,
                "profile_sidebar_fill_color" : "3C233A",
                "location" : "Newark, UK",
                "default_profile" : false,
                "followers_count" : 902,
                "profile_background_color" : "1A1B1F",
                "verified" : false,
                "utc_offset" : 0,
                "name" : "Marcin Floryan",
                "lang" : "en",
                "listed_count" : 70,
                "profile_background_image_url_https" : "https://twimg0-a.akamaihd.net/profile_background_images/348470662/stripes-bar.png",
                "profile_background_image_url" : "http://a0.twimg.com/profile_background_images/348470662/stripes-bar.png",
                "protected" : false,
                "profile_link_color" : "82005B",
                "statuses_count" : 10208,
                "contributors_enabled" : false,
                "time_zone" : "London",
                "profile_image_url" : "http://a0.twimg.com/profile_images/2937061550/9a191f44ea3292fde5a3ffa276369460_normal.png",
                "created_at" : "Mon May 11 13:23:18 +0000 2009",
                "profile_use_background_image" : true,
                "following" : false,
                "profile_image_url_https" : "https://twimg0-a.akamaihd.net/profile_images/2937061550/9a191f44ea3292fde5a3ffa276369460_normal.png",
                "profile_text_color" : "666666",
                "geo_enabled" : true,
                "id_str" : "39249507",
                "default_profile_image" : false,
                "url" : "http://marcin.floryan.pl/",
                "is_translator" : false,
                "profile_sidebar_border_color" : "2A031F",
                "favourites_count" : 993,
                "friends_count" : 377,
                "follow_request_sent" : false,
                "screen_name" : "mfloryan",
                "notifications" : false,
                "description" : "The question isn't who is going to let me; it's who is going to stop me. Agile software engineer helping teams improve. Addicted to learning.",
                "profile_background_tile" : true },
            "source" : { "id" : 149669540,
                "profile_sidebar_fill_color" : "EADEAA",
                "location" : "Istanbul",
                "default_profile" : false,
                "followers_count" : 46,
                "profile_background_color" : "8B542B",
                "verified" : false,
                "utc_offset" : -18000,
                "name" : "Onur Alp Soner",
                "lang" : "en",
                "listed_count" : 0,
                "profile_background_image_url_https" : "https://twimg0-a.akamaihd.net/images/themes/theme8/bg.gif",
                "profile_background_image_url" : "http://a0.twimg.com/images/themes/theme8/bg.gif",
                "protected" : false,
                "profile_link_color" : "9D582E",
                "statuses_count" : 111,
                "contributors_enabled" : false,
                "time_zone" : "Quito",
                "profile_image_url" : "http://a0.twimg.com/profile_images/1338933388/IMG_0328_normal.jpg",
                "created_at" : "Sat May 29 22:33:22 +0000 2010",
                "profile_use_background_image" : true,
                "following" : false,
                "profile_image_url_https" : "https://twimg0-a.akamaihd.net/profile_images/1338933388/IMG_0328_normal.jpg",
                "profile_text_color" : "333333",
                "geo_enabled" : false,
                "id_str" : "149669540",
                "default_profile_image" : false,
                "url" : "http://count.ly",
                "is_translator" : false,
                "profile_sidebar_border_color" : "D9B17E",
                "favourites_count" : 593,
                "friends_count" : 47,
                "follow_request_sent" : false,
                "screen_name" : "oasoner",
                "notifications" : false,
                "description" : "In a close relationship with MongoDB and Node.js @gocountly",
                "profile_background_tile" : false },
            "target_object" : { "entities" : { "urls" : [],
                "user_mentions" : [],
                "hashtags" : [] },
                "user" : { "profile_banner_url" : "https://twimg0-a.akamaihd.net/profile_banners/39249507/1348652087",
                    "id" : 39249507,
                    "profile_sidebar_fill_color" : "3C233A",
                    "location" : "Newark, UK",
                    "default_profile" : false,
                    "followers_count" : 902,
                    "profile_background_color" : "1A1B1F",
                    "verified" : false,
                    "utc_offset" : 0,
                    "name" : "Marcin Floryan",
                    "lang" : "en",
                    "listed_count" : 70,
                    "profile_background_image_url_https" : "https://twimg0-a.akamaihd.net/profile_background_images/348470662/stripes-bar.png",
                    "profile_background_image_url" : "http://a0.twimg.com/profile_background_images/348470662/stripes-bar.png",
                    "protected" : false,
                    "profile_link_color" : "82005B",
                    "statuses_count" : 10208,
                    "contributors_enabled" : false,
                    "time_zone" : "London",
                    "profile_image_url" : "http://a0.twimg.com/profile_images/2937061550/9a191f44ea3292fde5a3ffa276369460_normal.png",
                    "created_at" : "Mon May 11 13:23:18 +0000 2009",
                    "profile_use_background_image" : true,
                    "following" : false,
                    "profile_image_url_https" : "https://twimg0-a.akamaihd.net/profile_images/2937061550/9a191f44ea3292fde5a3ffa276369460_normal.png",
                    "profile_text_color" : "666666",
                    "geo_enabled" : true,
                    "id_str" : "39249507",
                    "default_profile_image" : false,
                    "url" : "http://marcin.floryan.pl/",
                    "is_translator" : false,
                    "profile_sidebar_border_color" : "2A031F",
                    "favourites_count" : 993,
                    "friends_count" : 377,
                    "follow_request_sent" : false,
                    "screen_name" : "mfloryan",
                    "notifications" : false,
                    "description" : "The question isn't who is going to let me; it's who is going to stop me. Agile software engineer helping teams improve. Addicted to learning.",
                    "profile_background_tile" : true },
                "place" : null,
                "retweet_count" : 0,
                "in_reply_to_status_id" : null,
                "in_reply_to_status_id_str" : null,
                "created_at" : "Sat Mar 09 23:02:00 +0000 2013",
                "in_reply_to_user_id_str" : null,
                "contributors" : null,
                "in_reply_to_screen_name" : null,
                "favorited" : true,
                "geo" : null,
                "coordinates" : null,
                "truncated" : false,
                "text" : "The node.js-twitter-cube-cubism project for the night completed. Pretty happy with my graphs :)",
                "id_str" : "310525908249346048",
                "source" : "<a href=\"http://itunes.apple.com/us/app/twitter/id409789998?mt=12\" rel=\"nofollow\">Twitter for Mac</a>",
                "in_reply_to_user_id" : null,
                "id" : 3.10525908249346e+17,
                "retweeted" : false } };

        var event = twitterEvents.transform(data);

        expect(event.content).toBe(data);
        expect(event.subject).toBe('tweet');
        expect(event.event).toBe('favorite');
        expect(event.statusId).toBe(data.target_object.id);
    });

});
