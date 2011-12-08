/*############################################################

					TUI JS LIBRARY 
	
						#TUI 
	Semantic Microblogging in Community Genome Annotation
			https://github.com/andrew-smith/TUI

	
	
Work in progress (not currently used in plugin)
This file will be the main TUI library - hopefully browser 
independent. It will contain an TUI object with all the 
functions available to use on a page.
############################################################*/

//define the tui namespace
var TUI = {


	/* Meta Data Tags */
	META_TUI_ID: "tui-id",
	META_TUI_TYPE: "tui-type",
	META_TUI_LIKE_COUNT: "tui-like-count",
	META_TUI_DISLIKE_COUNT: "tui-dislike-count",


	//initializes the TUI object
	_init: function() {
	
		//ensure JQuery loaded
		if(!jQuery) throw('JQuery not loaded');
		//ensure sprintf loaded
		if(!sprintf) throw ('sprintf not loaded');
		
		//init all the meta-data tags (just placeholders)
		TUI.__appendToHead(TUI.META_TUI_ID, "0");
		TUI.__appendToHead(TUI.META_TUI_TYPE, "0");
		TUI.__appendToHead(TUI.META_TUI_LIKE_COUNT, "0");
		TUI.__appendToHead(TUI.META_TUI_DISLIKE_COUNT, "0");
	
	},
	
	//helper method for appending data to the head
	__appendToHead: function(id, content) { 
		$('head').append('<meta name="' + id + '" content="' + content + '" />');
	},
	
	
	//adds <meta> tags to the head of the document so we can quickly access tui data 
	_encodeTuiMetaData: function() {
	
		dlog("adding data to head");
	
		var params = getUrlVars();
	
		//get the type
		TUI.setTuiMeta(TUI.META_TUI_TYPE, getUrlVars()["type"]);
	
		//first need to see what type of page this is
		switch(TUI.getTuiMeta(TUI.META_TUI_TYPE))
		{
		
			case "gene" : TUI.__findTargetId('Gene Model: '); break;
			case "locus": TUI.__findTargetId('Locus: '); break;
			case "aa_sequence": TUI.__findTargetId('Protein: '); break;
		}
	},
	
	//finds the first table td element that contains tdContent
	//then the rest of the innerText is assumed to the the id
	__findTargetId: function(tdContent) {
	
		var el = $('td').find(":contains('" + tdContent + "')")[0];
		
		var data = el.innerText.substring(tdContent.length);
		data = $.trim(data);
		
		TUI.setTuiMeta(TUI.META_TUI_ID, data);
	},
	
	
	//gets one of the meta-data tag content that has been dynamically inserted inside the page
	getTuiMeta: function(tagName) {
		return $('meta[name=' + tagName + ']').attr("content");
	},
	
	//sets one of the meta-data tag content that has been dynamically inserted inside the page
	setTuiMeta: function(tagName, content) {
		$('meta[name=' + tagName + ']').attr("content", content);
	},
	
	
	//creates a like menu next to the page title / header
	_createLikeMenu: function() {
	
		//dlog("creating like menu");
	
	},
	

	//checks if the current page looks like a GBrowse site
	isValidTuiPage: function()
	{
		var params = getUrlVars();
		//if(params["name"] && params["type"] && params["type"] == "gene")
		if(location.href.indexOf("http://www.arabidopsis.org/servlets/TairObject?") == 0)
		{
			return true;
		}
	
		return false;
	},
	
	

	//checks the page for correct features and loads the tui object
	load: function() {
		
		dlog("Checking if valid TUI page");
		if(TUI.isValidTuiPage())
		{
			dlog("Valid TUI Page");
			
			//ensure we have all the libs loaded
			TUI._init();
			
			//pass loading to JQuery 
			$(document).ready(function() {
				//adds meta-data to the page
				TUI._encodeTuiMetaData();
				//embeds a like menu to the page
				TUI._createLikeMenu();
			});
			
		}
		else
		{
			dlog("Not a valid TUI page");
		}
	}
};


//source: http://papermashup.com/read-url-get-variables-withjavascript/
function getUrlVars() {
	var vars = {};
	var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
		vars[key] = value;
	});
	return vars;
}

//debug log for chrome
function dlog(text)
{
	if(navigator.userAgent.toLowerCase().indexOf('chrome') > -1)
		console.log("#tui: " + text);
}