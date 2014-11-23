var strEvents = "";
var strArtists = "";
var eventTitle;
var eventArtist;
var eventVenueName;
var eventStartDate;

$(document).ready(function(){ 
$.getJSON('https://ws.audioscrobbler.com/2.0/?method=geo.getevents&location=philadelphia&api_key=5f2e84314314b96931be6aad03b0fe6c&format=json&limit=9&callback=?', function(data) {
	$.each(data.events.event, function(i,event){
		
		eventTitle = event.title;
		eventArtist = event.artists.artist;
		//eventVenueName = event.venue.name;
		if (typeof(event.venue)!="undefined"){
			eventVenueName = event.venue.name
		}
		eventStartDate = event.startDate;
		
		strEvents = strEvents + '<div id="' + i + '" class="inside"><h2>' + eventTitle + '</h2> featuring <strong>'+ eventArtist +'</strong> performing at '+ eventVenueName +'.  '+ eventStartDate +'.';
		if (event.website != "null" && event.website != "") {
		  strEvents = strEvents + '<a href="'+event.website+'" target="_blank" style="float:right">Tickets &raquo;</a>';
		}
		if (event.image[3]['#text'] != "undefined" && event.image[3]['#text'] != "" && event.image[3]['#text'] != "null") {
			strEvents = strEvents + "<br/><img src='" + event.image[3]['#text'] + "' style='margin-top:15px;border:1px solid #dadada'>";
		}
		else
		{
			strEvents = strEvents + "<div style='text-align:center;color:#7a7a7a'><br/><br/><br/><br/>[artist image not available]</div>";
		}
		strEvents = strEvents + "<br/><br/><br/></div>";
	});
	$(document).ready(function(){ 
		$('<div>', {
    		'class': 'my-new-list',
    		html:strEvents
  		}).appendTo('#main_content_section');
	});
});

});

