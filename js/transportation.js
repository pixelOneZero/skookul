// Begin: Define and initialize the transporation object:
site.transportation = {
	map:"",
	mobile:false,
	markersArray:[],
	routesArray:[],
	infoWindowsArray:[],
	selectedRouteNumber:"",
	intGetLocations:"",
	dt:new Date(),
	strLoading:"<img src='../images/icon-loading.gif' id='icon-loading-data' />",
	kmlTrain:"http://skookul.com/transportation/kml/regionalrail.kml",
	transitType:"bus",
	self:this,
	setTransitType: function(selectedType) {
		var milli = site.transportation.dt.getTime();
		site.transportation.transitType = selectedType;
		site.transportation.clearOverlays();
		site.transportation.clearRoute();
		clrIntGetLocations=window.clearInterval(site.transportation.intGetLocations);
		if (selectedType=="train") {
			site.transportation.kmlTrain = site.transportation.kmlTrain + "?dst=" + milli;
			var routeLayer = new google.maps.KmlLayer(site.transportation.kmlTrain);
			routeLayer.setMap(map);
			site.transportation.routesArray.push(routeLayer);
		}
	},
	loadMap: function() {
		var myOptions = {center: new google.maps.LatLng(39.952335,-75.163789),zoom: 12,mapTypeId: google.maps.MapTypeId.ROADMAP};
		map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
	},
	setMarkers: function(busLat, busLong, busDirection, busDestination, data) {
			var myLatlng = new google.maps.LatLng(busLat,busLong);
			var marker = new google.maps.Marker({
			position: myLatlng,
			animation: google.maps.Animation.DROP,
			icon: '../images/marker-' + site.transportation.transitType + '.png',
			map: map
		});
		site.transportation.setInfoWindows(marker,busDirection,busDestination, data);
		site.transportation.markersArray.push(marker);
	},
	clearOverlays: function(){
		if (site.transportation.markersArray) {
			for (i in site.transportation.markersArray) {
				site.transportation.markersArray[i].setMap(null);
			}
		}
	},
	clearRoute:function(){
		if (site.transportation.routesArray) {
			for (i in site.transportation.routesArray) {
				site.transportation.routesArray[i].setMap(null);
			}
		}
	},
	clearInfoWindows: function(){
		if (site.transportation.infoWindowsArray) {
		for (i in site.transportation.infoWindowsArray) {
			site.transportation.infoWindowsArray[i].close();
		}
		}
	},
	getLocations:function(routeNumber, resetZoom){
		site.transportation.clearOverlays();
		var d=new Date();
		var milliseconds = d.getTime();
		if (site.transportation.transitType=="bus" || site.transportation.transitType=="trolley") {
			$.getJSON('http://www3.septa.org/hackathon/TransitView/?route='+routeNumber+'&dm='+milliseconds+'&callback=?', function(data) {
				$("#icon-loading-data").hide();
				$.each(data.bus, function(i,bus){
					site.transportation.setMarkers(bus.lat, bus.lng, bus.Direction, bus.destination, bus);
					if (i==data.bus.length-1) {
						var myLatlng = new google.maps.LatLng(bus.lat, bus.lng);
						map.panTo(myLatlng);
					}
				});
			});
		}
		else {
			var destination;
			$.getJSON('http://www3.septa.org/hackathon/TrainView/?dm='+milliseconds+'&callback=?', function(data) {
				$("#icon-loading-data").hide();
				$.each(data, function(i){
					destination = (data[i].dest).toLowerCase();
					destination = destination.replace(/\s/g,"-");
					if (destination==routeNumber) {
						if (data[i].service != "NO PSGRS") {
							site.transportation.setMarkers(data[i].lat, data[i].lon, data[i].nextstop, data[i].dest, data[i]);
							var myLatlng = new google.maps.LatLng(data[i].lat, data[i].lon);
							map.panTo(myLatlng);
						}
						
					}
				});
			});
		}
	},
	setRoute:function(kmlName){
		var routeLayer;
		var milli = site.transportation.dt.getTime();
		if (site.transportation.transitType=="bus" || site.transportation.transitType=="trolley") {
			routeLayer = new google.maps.KmlLayer('http://www3.septa.org/transitview/kml/'+kmlName+'.kml?dts='+milli);
		}
		else {
			routeLayer = new google.maps.KmlLayer('http://skookul.com/transportation/kml/' + site.transportation.selectedRouteNumber + '.kml?dts='+milli);
		}
		if (typeof(routeLayer)!="undefined") {
			routeLayer.setMap(map);
			site.transportation.routesArray.push(routeLayer);
		}
	},
	toggleGrid:function(){
		if (site.transportation.transitType=="train") {
			$('.grid .bus').hide();
			$('.grid .trolley').hide();
			$('.grid .train').show();
		}
		else if (site.transportation.transitType=="trolley") {
			$('.grid .train').hide();
			$('.grid .bus').hide();
			$('.grid .trolley').show();
		}
		else
		{
			$('.grid .train').hide();
			$('.grid .trolley').hide();
			$('.grid .bus').show();
		}
		$('.'+site.transportation.transitType+' div.grid-cell').each(function(){
			if ($(this).attr("class")=="grid-cell active") {
				$(this).trigger("click");
			}
		});
		if (site.transportation.mobile) {
			$(".grid").show();
		}
	},
	setLinks:function(){

		$("nav > a").click(function(){
			$(".left-col > nav > a").removeClass("active");
		});
		$(".grid-cell").click(function(){
			 $(".grid-cell").removeClass("active");
		})

		$("a[rel=train]").click(function(){
			site.transportation.setTransitType("train"); 
			site.transportation.setAppState("train","1");
			site.transportation.toggleGrid();
			$(this).addClass("active");
		});
		$("a[rel=bus]").click(function(){
			site.transportation.setTransitType("bus"); 
			site.transportation.setAppState("bus","1");
			site.transportation.toggleGrid();
			$(this).addClass("active");
		});
		$("a[rel=trolley]").click(function(){
			site.transportation.setTransitType("trolley"); 
			site.transportation.setAppState("trolley","1");
			site.transportation.toggleGrid();
			$(this).addClass("active");
		});
		$(".bus .grid-cell").click(function(){
			site.transportation.transitType = "bus";
			$("#icon-loading-data").show();
			clrIntGetLocations=window.clearInterval(site.transportation.intGetLocations);
			site.transportation.selectedRouteNumber = $(this).attr("rel");
			site.transportation.setAppState("-"+site.transportation.selectedRouteNumber,"0");
			site.transportation.clearOverlays();
			site.transportation.clearRoute();
			site.transportation.setRoute(site.transportation.selectedRouteNumber);
			site.transportation.getLocations(site.transportation.selectedRouteNumber,'0');
			site.transportation.intGetLocations = self.setInterval("site.transportation.getLocations("+site.transportation.selectedRouteNumber+", '0')",60000);
			$(this).addClass("active");
		});
		$(".train .grid-cell").click(function(){
			site.transportation.transitType = "train";
			$("#icon-loading-data").show();
			clrIntGetLocations=window.clearInterval(site.transportation.intGetLocations);
			site.transportation.selectedRouteNumber = $(this).attr("rel");
			site.transportation.setAppState("-"+site.transportation.selectedRouteNumber,"0");
			site.transportation.clearOverlays();
			site.transportation.clearRoute();
			site.transportation.setRoute(site.transportation.selectedRouteNumber);
			site.transportation.getLocations(site.transportation.selectedRouteNumber,'0');
			site.transportation.intGetLocations = self.setInterval("site.transportation.getLocations('"+site.transportation.selectedRouteNumber+"', '0')",60000);
			$(this).addClass("active");
		});
		$(".trolley .grid-cell").click(function(){
			site.transportation.transitType = "trolley";
			$("#icon-loading-data").show();
			clrIntGetLocations=window.clearInterval(site.transportation.intGetLocations);
			site.transportation.selectedRouteNumber = $(this).attr("rel");
			site.transportation.setAppState("-"+site.transportation.selectedRouteNumber,"0");
			site.transportation.clearOverlays();
			site.transportation.clearRoute();
			site.transportation.setRoute(site.transportation.selectedRouteNumber);
			site.transportation.getLocations(site.transportation.selectedRouteNumber,'0');
			site.transportation.intGetLocations = self.setInterval("site.transportation.getLocations('"+site.transportation.selectedRouteNumber+"', '0')",60000);
			$(this).addClass("active");
		});

		$(".grid-cell").click(function(){
			if (site.transportation.mobile) {
				$(".grid").hide();
			}
		});

		$(".locateUser").click(function(){
			site.transportation.getUserLocation(true);
		});
		
	},
	setInfoWindows:function(thisMarker,direction,destination, data){
		var contentString;
		var punctualityLabel;
		
		// Trains:
		if (site.transportation.transitType=="train") {
			var minLabel = (Math.abs(data.late) < 2) ? " minute" : " minutes";
			if (data.late < 0) {
				punctualityLabel = Math.abs(data.late) + minLabel + " ahead of schedule.";
			}
			else if (data.late == 0) {
				punctualityLabel = "Running on time.";
			}
			else {
				punctualityLabel = data.late + minLabel + " behind schedule.";
			}
			contentString = '<dl><dt>'+site.transportation.transitType+' number: </dt><dd>'+data.trainno+'</dd><dt>Next stop: </dt><dd>'+direction+'</dd><dt>Destination:</dt><dd>'+destination+'</dd></dl><span>' + punctualityLabel+'</span>';
		} 
		// Bus or trolley:
		else if (site.transportation.transitType=="bus" || site.transportation.transitType=="trolley") {
			var busOffsetTime = (Math.abs(data.Offset) < 1) ? " < 1 " : data.Offset;
			var busOffsetLabel = (Math.abs(data.Offset) < 2) ? " minute " : " minutes ";
			contentString = '<dl><dt>Route:</dt><dd>'+site.transportation.selectedRouteNumber+'</dd><dt>'+site.transportation.transitType+' Number:</dt><dd>'+data.VehicleID+'</dd><dt>Headed: </dt><dd>'+direction+'</dd></dl><small>Last updated ' + busOffsetTime + busOffsetLabel + ' ago.</small>';
		}
		// Vehicle not moving:
		if (direction.replace(/\s/g,"") == "" && destination.replace(/\s/g,"") == "") {
			contentString = '<dl><dt>'+site.transportation.transitType+' Number:</dt><dd>'+data.VehicleID+'</dd></dl><small><strong>Note:</strong>This '+site.transportation.transitType+' is not currently moving.</small>';
		}

		contentString += '<a href="https://twitter.com/share?text=' + document.title + '&url=' + encodeURIComponent(location.href) + '" class="twitter-share-button" data-via="Skookul" data-related="Skookul" data-count="none" data-hashtags="Skookul" target="_blank"><img src="/images/twitter.png" />Tweet</a>';
		contentString += "<script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document, 'script', 'twitter-wjs');</script>";

		var infowindow = new google.maps.InfoWindow({
			content: contentString
		});
		site.transportation.infoWindowsArray.push(infowindow);
		google.maps.event.addListener(thisMarker, 'click', function() {
			site.transportation.clearInfoWindows();
			infowindow.open(map,thisMarker);
		});
	},
	setAppState:function(hashValue, changedTransitType) {
		if (changedTransitType == "1") {
			window.location.hash = "";
			window.location.hash = hashValue;
		}
		else {
			if ((window.location.hash).indexOf("-") > -1) {
				window.location.hash = (window.location.hash).substring(0, (window.location.hash).indexOf("-"));
			}
			window.location.hash = window.location.hash + hashValue;
		}
	},
	/*
	getAppState: Shows vehicle on map if present in hash value of current url. This allows bookmarking and sharing of links.
	*/
	getAppState:function() {
		var transitType;
		var vehicleId;
		if (window.location.hash != "") {
			if ((window.location.hash).indexOf("-") > -1) {
				transitType = (window.location.hash).substring(1, (window.location.hash).indexOf("-"));
				vehicleId = (window.location.hash).substring((window.location.hash).indexOf("-")+1, (window.location.hash).length);
				if (site.transportation.mobile) {
					$(".grid").hide();
				}
			}
			else
			{
				transitType = (window.location.hash).substring(1, (window.location.hash).length);
				$("a[rel=" + transitType + "]").addClass("active");
			}

			if (typeof(vehicleId) != "undefined") {
				window.location = "http://skookul.com" + window.location.pathname + "#" + transitType + "-" + vehicleId;

				site.transportation.transitType = transitType;
				clrIntGetLocations=window.clearInterval(site.transportation.intGetLocations);
				site.transportation.selectedRouteNumber = vehicleId;
				site.transportation.setAppState("-"+site.transportation.selectedRouteNumber,vehicleId);
				site.transportation.clearOverlays();
				site.transportation.clearRoute();
				site.transportation.setRoute(site.transportation.selectedRouteNumber);
				site.transportation.getLocations(site.transportation.selectedRouteNumber,'0');
				site.transportation.intGetLocations = self.setInterval("site.transportation.getLocations("+site.transportation.selectedRouteNumber+", '0')",60000);
				
				$("a[rel=" + transitType + "]").addClass("active");
				$("div[rel="+vehicleId+"]").addClass("active");
			}
		}
		else
		{
			window.location.hash = "#bus";
			$("a[rel=bus]").addClass("active");
		}
	},
	getUserLocation:function(centeredOnUser) {
		var infowindow = new google.maps.InfoWindow();
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function(position) {
				var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
				geocoder = new google.maps.Geocoder();
				geocoder.geocode({'latLng': latlng}, function(results, status) {
					if (status == google.maps.GeocoderStatus.OK) {
						if (results[0]) {
							var image = '../images/icon-current-location.png';
					   		marker = new google.maps.Marker({
								position: latlng,
						  		map: map,
						  		icon:image
					  		});
					  		if (centeredOnUser) {
								map.setZoom(12);
								map.setCenter(latlng);
							}
						}
				  	} 
				  	else {
						alert("Geocoder failed due to: " + status);
				  	}
				});
			});
		} 
		else {
  			alert("Sorry, geolocation services are not supported by your browser.");
		}
	}
}

// Begin: Initialize the application:
$(document).ready(function(){
	if (window.outerWidth < 600) {
		site.transportation.mobile = true;
	}
	if (site.transportation.mobile) {
		$(".left-col > nav").append(site.transportation.strLoading);
	}
	else
	{
		$(".left-col h2").append(site.transportation.strLoading);
	}
	site.transportation.loadMap();
	site.transportation.setLinks();
	site.transportation.getAppState();
	$("#icon-loading-data").hide();
});