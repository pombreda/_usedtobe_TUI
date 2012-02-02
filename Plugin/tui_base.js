/*############################################################

                    TUI JS LIBRARY 
    
                        #TUI 
    Semantic Microblogging in Community Genome Annotation
            https://github.com/andrew-smith/TUI

	
	
This file is the main TUI library that supplies base functions
               to assist other TUI plugins
############################################################*/

"use strict";

//debug log for chrome
function dlog(text) {
    if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
        console.log("#tui: " + text);
    }
}

//define the tui namespace
var TUI = {

    VERSION: "testing",

    /* Meta Data Tags */
    META_TUI_ID: "tui-id",
    META_TUI_ID_PREFIX: "tui-id-prefix",
    META_TUI_TYPE: "tui-type",
    META_TUI_LIKE_COUNT: "tui-like-count",
    META_TUI_DISLIKE_COUNT: "tui-dislike-count",

    /* Tui like format */
    LIKE_FORMAT: ' #tui I %s %s:%s',
    /* Tui change title format */
    TITLE_FORMAT: ' #tui %s:%s dc:title %s',
    /* Tui comment format */
    COMMENT_FORMAT: ' #tui %s:%s tui:comment %s',

    //initializes the TUI object
    _init: function () {

        dlog("Version: " + TUI.VERSION);

        //ensure JQuery loaded
        if (!jQuery) {
            throw ('JQuery not loaded');
        }
        //ensure sprintf loaded
        if (!sprintf) {
            throw ('sprintf not loaded');
        }

        //init all the meta-data tags (just placeholders)
        TUI.__appendToHead(TUI.META_TUI_ID, "0");
        TUI.__appendToHead(TUI.META_TUI_ID_PREFIX, "null");
        TUI.__appendToHead(TUI.META_TUI_TYPE, "0");
        TUI.__appendToHead(TUI.META_TUI_LIKE_COUNT, "0");
        TUI.__appendToHead(TUI.META_TUI_DISLIKE_COUNT, "0");
    },

    //helper method for appending data to the head
    __appendToHead: function (id, content) {
        $('head').append('<meta name="' + id + '" content="' + content + '" />');
    },


    //gets one of the meta-data tag content that has been dynamically inserted inside the page
    getTuiMeta: function (tagName) {
        return $('meta[name=' + tagName + ']').attr("content");
    },

    //sets one of the meta-data tag content that has been dynamically inserted inside the page
    setTuiMeta: function (tagName, content) {
        $('meta[name=' + tagName + ']').attr("content", content);
        
        //if it is a change of the like/dislike count - then notify listeners
        switch(tagName)
        {
            case TUI.META_TUI_LIKE_COUNT: TUI.notifyLikeCountChange();
                break; 
            case TUI.META_TUI_DISLIKE_COUNT: TUI.notifyDislikeCountChange();
                break;
        }
    },

    //creates a tui like message for the current viewing page
    createTuiLike: function () {

        //grab the current object name
        var name = TUI.getTuiMeta(TUI.META_TUI_ID_PREFIX),
            id = TUI.getTuiMeta(TUI.META_TUI_ID);

        return sprintf(TUI.LIKE_FORMAT, 'like', name, id);
    },

    //creates a tui dislike message for the current viewing page
    createTuiDislike: function () {

        //grab the current object name
        var name = TUI.getTuiMeta(TUI.META_TUI_ID_PREFIX),
            id = TUI.getTuiMeta(TUI.META_TUI_ID);

        return sprintf(TUI.LIKE_FORMAT, 'dislike', name, id);
    },


    //creates a tui change-title formatted message
    createChangeTitleMessage: function (newTitle) {
        var name = TUI.getTuiMeta(TUI.META_TUI_ID_PREFIX),
            id = TUI.getTuiMeta(TUI.META_TUI_ID),
            title = TUI.encodeTuiString(newTitle);

        return sprintf(TUI.TITLE_FORMAT, name, id, title);
    },

    //creates a tui comment formatted message
    createComment: function (comment) {
        var name = TUI.getTuiMeta(TUI.META_TUI_ID_PREFIX),
            id = TUI.getTuiMeta(TUI.META_TUI_ID);
        comment = TUI.encodeTuiString(comment);

        return sprintf(TUI.COMMENT_FORMAT, name, id, comment);
    },

    //gets the current id (eg ATG10101.1)
    getCurrentId: function () {
        return TUI.getTuiMeta(TUI.META_TUI_ID);
    },

    //gets the current type (eg gene, locus)
    getCurrentType: function () {
        return TUI.getTuiMeta(TUI.META_TUI_TYPE);
    },

    //encodes a string to TUI definition 
    encodeTuiString: function (str) {

        //first trim the whitespace from the ends of the string
        str = $.trim(str);

        //check if it contains whitespace
        //if it does contain whitespace then is not needed to have quote marks around it
        if (!(/\s/.test(str))) {
            //if it DOESN'T contain whitespace then we need to surround it with quote marks
            //AND also escape it so we can be sure that is doesn't contain any " or \ /
            str = '"' + escape(str) + '"';
        }

        return str;
    },
    
    //listener section for values being updated
    LIKE_COUNT_CHANGE_TRIGGER: 'tuiLikeCountChange', 
    DISLIKE_COUNT_CHANGE_TRIGGER: 'tuiDisikeCountChange', 
    
    //attach a listener function to listen for changes in the like count
    onLikeCountChange: function(listener) {
        $(document).bind(TUI.LIKE_COUNT_CHANGE_TRIGGER, function() { listener(); });
    },
    
    //triggers the dislike count change listeners to execute
    notifyLikeCountChange: function() {
        $(document).trigger(TUI.LIKE_COUNT_CHANGE_TRIGGER);
    },
    
    //attach a listener function to listen for changes in the dislike count
    onDislikeCountChange: function(listener) {
        $(document).bind(TUI.DISLIKE_COUNT_CHANGE_TRIGGER, function() { listener(); });
    },
    
    //triggers the dislike count change listeners to execute
    notifyDislikeCountChange: function() {
        $(document).trigger(TUI.DISLIKE_COUNT_CHANGE_TRIGGER);
    },
    
    //event name to call
    ON_READY_TRIGGER: 'tuiLoaded',
    //true if the event has been called - false otherwise
    onReady_called: false,
    
    //attach a listener to listen out for when TUI has finished loading and ready to use 
    //listener = method to call when ready
    onReady: function(listener) {
        //if it has been called already then just run the function now
        if(TUI.onReady_called) {
            listener();
        }
        else {
            $(document).bind(TUI.ON_READY_TRIGGER, function() { listener(); });
        }
    },
    
    //internal function to call tuiLoaded method
    _TUIReady: function () {
        
        //only trigger it if it has not been triggered yet.
        if(!TUI.onReady_called)
        {
            $(document).trigger(TUI.ON_READY_TRIGGER);
            TUI.onReady_called = true;
        }
    },

    //loads the tui object and injects data into 
    init: function () {

        //ensure we have all the libs loaded
        //and inject empty elements onto the page
        TUI._init();

        //once that has been completed - notify all listeners that it is safe to start working
        TUI._TUIReady();
        
        //now search twitter to get the latest count of tweets
        var searchQuery = "#tui " + TUI.getTuiMeta(TUI.META_TUI_ID_PREFIX) + ":" + TUI.getTuiMeta(TUI.META_TUI_ID);
        TUIServiceProvider.search(searchQuery, function(data) {
            if(data)
            {
                $.each(data,function(i,msg)
                {
                    var message = msg.message.toLowerCase();
                    if(msg.username.toLowerCase() == "tuibot" && message.indexOf(searchQuery) === 0)
                    {
                    
                        //assert that it is a valid message
                        if(message.indexOf("like:") > -1 && message.indexOf("dislike:") > -1)
                        {
                            var split = message.split(" ");
                            
                            var likeCount = split[2].split(":")[1];
                            var dislikeCount = split[3].split(":")[1];
                            
                            TUI.setTuiMeta(TUI.META_TUI_LIKE_COUNT, likeCount);
                            TUI.setTuiMeta(TUI.META_TUI_DISLIKE_COUNT, dislikeCount);
                        }
                    }
                });
            }
        });
    }
};
