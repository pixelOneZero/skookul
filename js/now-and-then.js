/*

Big things to build or fix:
/1.) Do a quick code clean up given goals below.
/2.) Limit number of requests to phillyhistory.org.
/3.) Use Google's Panaramio library to display contemporary photos.
/4.) Make entire InfoWindow visible when opened.
/5.) Limit requests to Google's geocoding service. (Solved: Limit is 2500 per client user, not per domain, per day.)

Smaller things to build or fix:
/1.) Attribute content to phillyhistory.org and Panaramio.
/2.) Write consice, descriptive intro copy.
3.) Display 'loading' animated gif for long processing requests.

Requirements for beta release:
/- Page loads centered on Philadelphia.
	/- KML layer is automatically displayed showing an outline of Philadelphia's city limits.
	/- Group of markers automatically drops for historical and contemporary photos, centered on city hall.
/- User clicks either Panaramio or red marker and InfoWindow displays with photo and textual info inside.
/- User clicks map and more Panaramio and red markers appear in a certain radius surround the point clicked.
	- All markers previously displayed are cleared.

Added requirements for alpha release:
- When page loads, if user is located in city limits, place a green star at their position.
- User enters a street address
	- Map centers on address and markers are dropped if available.
- Whenever markers are displayed on map, display thumbnails of photos corresponding to those markers.
	- When user clicks on thumbnail, open InfoWindow for corresponding marker.

*/

site.nowThen = {
	map:"",
	markersArray:[],
	neighborhoodArray:[],
	infoWindowsArray:[],
	strLoading:"<img src='/images/icon-loading.gif' id='icon-loading-data' style='display:none;position:absolute;top:25px;left:25px;z-index:2;' /> <div>Loading...</div>",
	kmlCityLimits:"http://skookul.com/neighborhoods/city-limits.kml?uid=3",
	cityLimitsLayer:"",
	historicalSearchTerm:"",
	mapSharedImage:false,
	latSharedImage:"",
	lngSharedImage:"",
	phId:"",
	loadMap: function() {
		var myOptions = {center: new google.maps.LatLng(39.952335,-75.163789),zoom:17,mapTypeId: google.maps.MapTypeId.ROADMAP};
		site.nowThen.map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
	},
	setKml:function() {
		site.nowThen.cityLimitsLayer = new google.maps.KmlLayer(site.nowThen.kmlCityLimits,  { map:site.nowThen.map, preserveViewport: true});
		site.nowThen.cityLimitsLayer.setMap(site.nowThen.map);
		site.nowThen.neighborhoodArray.push(site.nowThen.cityLimitsLayer);
	},
	loadMapSharedImage:function(){
		var queryString = window.location.search;
		var latStart = queryString.indexOf("ll=")+3;
		site.nowThen.latSharedImage = (queryString).substring(latStart, (queryString).indexOf(","));
		site.nowThen.lngSharedImage = (queryString).substring((queryString).indexOf(",")+1, (queryString).indexOf("&"));
		//console.log(site.nowThen.latSharedImage);
		//console.log(site.nowThen.lngSharedImage);
		var myOptions = {center: new google.maps.LatLng(site.nowThen.latSharedImage,site.nowThen.lngSharedImage),zoom:17,mapTypeId: google.maps.MapTypeId.ROADMAP};
		site.nowThen.map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
	},
	getThenImages: function(){
		var thenImages = $("#response-frame").contents().text();
		thenImages = thenImages.substring(thenImages.indexOf("{"), thenImages.lastIndexOf("}")+1)
		//console.log(thenImages);
		var json = $.parseJSON(thenImages);
		var output = "";
		if (typeof(json)!="undefined" && json!=null) { 
			if (site.nowThen.mapSharedImage==false) {
				imageUrl="";
				locName = "";
				locAddess = "";
				locDate = "";
				assetId = "";
				$.each(json.images, function(i,images) {
					imageUrl = images.url;
					imageId = imageUrl.substring(imageUrl.indexOf("=")+1, imageUrl.length);
					assetId = images.assetId;
					imageId= parseInt(imageId);
					imageId=imageId+1;
					//console.log("+1 = " + imageId);
					locName = images.name;
					locAddress = images.address;
					locDate = images.date;
					output = output + "<div style='width:110px;padding:5px;border:1px solid #aaa;height:125px;font-size:10px;float:left'>"+images.address+"<br/><img src='http://www.phillyhistory.org/PhotoArchive/"+images.url+"'/></div>";
					utm = images.loc.split('?');
					var source = new Proj4js.Proj('EPSG:900913');  
					var dest = new Proj4js.Proj('WGS84');     
					var coord1 = new Proj4js.Point(utm[1],utm[0]);
					var coord2 = new Proj4js.Point(utm[0],utm[1]);
					Proj4js.transform(source, dest, coord1);
					Proj4js.transform(source, dest, coord2);
					var myLatLng = new google.maps.LatLng(coord2.y,coord2.x);
					var marker = new google.maps.Marker({
						position: myLatLng,
						animation: google.maps.Animation.DROP,
						map: site.nowThen.map
					});
					site.nowThen.setInfoWindows(marker, json, imageUrl,locName,locAddress,locDate,coord2.y,coord2.x,assetId);
					site.nowThen.markersArray.push(marker);
				});
			}
			else
			{
				$.each(json.assets, function(i,assets) {
					imageUrl = "http://phillyhistory.org/PhotoArchive/MediaStream.ashx?mediaId="+assets.assetId;
					imageId = assets.medialist[i]['mediaId'];
					locName = assets.title;
					locAddress = assets.address;
					locDate = assets.date;
					assetId = assets.assetId;
					output = output + "<div style='width:110px;padding:5px;border:1px solid #aaa;height:125px;font-size:10px;float:left'>"+assets.address+"<br/><img src='"+imageUrl+"'/></div>";
					var myLatLng = new google.maps.LatLng(site.nowThen.latSharedImage,site.nowThen.lngSharedImage);
					var marker = new google.maps.Marker({
						position: myLatLng,
						animation: google.maps.Animation.DROP,
						map: site.nowThen.map
					});
					site.nowThen.setInfoWindows(marker, json, imageUrl,locName,locAddress,locDate,site.nowThen.latSharedImage,site.nowThen.lngSharedImage,assetId);
					site.nowThen.markersArray.push(marker);
					google.maps.event.trigger(marker, 'click');
					})
			}
			$("#icon-loading-data").hide();
			$("#loader").hide();
		}
	},
	getNowImages: function(){
		var response = $("#new-response-frame").contents().text();
		response = response.substring(response.indexOf("{"), response.lastIndexOf("}")+1)
		var json = $.parseJSON(response);
		var output = "";
		if (typeof(json)!="undefined" && json!=null) { 
			$.each(json.photos.photo, function(i,photo) {
				imgTag = "<div style='width:110px;padding:5px;border:1px solid #aaa;height:125px;font-size:10px;float:left'><img src='http://farm"+photo.farm+".static.flickr.com/"+photo.server+"/"+photo.id+"_"+photo.secret+"_s.jpg' /></div>";
				//console.log("photo.id = " + photo.id);
				output = output + imgTag;
				var myLatLng = new google.maps.LatLng(photo.lat,photo.lon);
				//site.nowThen.setNowImagesLocations(photo.id);
				var marker = new google.maps.Marker({
					position: myLatLng,
					animation: google.maps.Animation.DROP,
					map: site.nowThen.map
		});
			});
			//$("#header").append(output);
		}
	},
	getNowImagesLocations:function(){
				
				var currentBounds = site.nowThen.map.getBounds();
				var northEastLat = currentBounds.getNorthEast().lat();
				var northEastLng = currentBounds.getNorthEast().lng();
				var southWestLat = currentBounds.getSouthWest().lat();
				var southWestLng = currentBounds.getSouthWest().lng();
			
				$.getJSON('http://www.panoramio.com/map/get_panoramas.php?set=public&from=0&to=40&minx='+southWestLng+'&miny='+southWestLat+'&maxx='+northEastLng+'&maxy='+northEastLat+'&size=medium&mapfilter=true&callback=?', function(data) {
				//console.log(data)
		});
		
	},
	toggleNeighborhoodKml:function() {
		if (site.nowThen.neighborhoodArray.length==0) {
			site.nowThen.setKml();
		}
		else
		{
			if (site.nowThen.neighborhoodArray) {
				for (i in site.nowThen.neighborhoodArray) {
					site.nowThen.neighborhoodArray[i].setMap(null);
				}
			}
			site.nowThen.neighborhoodArray.length=0;
		}
	},
	resetMarkers: function() {
		$("#loader").show();
		$("#icon-loading-data").show();
		var infowindow = new google.maps.InfoWindow();
		var location = site.nowThen.map.getCenter();
		var latlng = new google.maps.LatLng(location.lat(), location.lng());
		if (site.nowThen.mapSharedImage == false) {
			geocoder = new google.maps.Geocoder();
			geocoder.geocode({'latLng': latlng}, function(results, status) {
				if (status == google.maps.GeocoderStatus.OK) {
					if (results[0]) {
						results[0].formatted_address= results[0].formatted_address.replace(/ /g,"+");
						$("#urlqs").val("type=address&address="+results[0].formatted_address + "&withoutMedia=false&withoutLoc=false&onlyWithoutLoc=false&updateDays=0&sortOrderM=DISTANCE&sortOrderP=DISTANCE&keywords=");
						$("#oldImages").submit();
					}
				} 
				else {
					alert("Geocoder failed due to: " + status);
				}
			});
		}
		else
		{
			var queryString = window.location.search;
			var idStart = queryString.indexOf("id=")+3;
			//console.log("333="+idStart);
			site.nowThen.phId = (queryString).substring(idStart, queryString.length);
			//console.log("444="+site.nowThen.phId);
			$("#assetId").val(site.nowThen.phId);
			$("#oldImage").submit();
		}
	},
	getUserLocation:function() {
		var infowindow = new google.maps.InfoWindow();
		if (navigator.geolocation) {
  			navigator.geolocation.getCurrentPosition(function(position) {
  				var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
				geocoder = new google.maps.Geocoder();
				geocoder.geocode({'latLng': latlng}, function(results, status) {
					if (status == google.maps.GeocoderStatus.OK) {
						if (results[0]) {
							site.nowThen.map.setZoom(15);
							site.nowThen.map.setCenter(latlng);
							var image = '../images/star.png';
					   		marker = new google.maps.Marker({
								position: latlng,
						  		map: site.nowThen.map,
						  		icon:image
					  		});
					   		infowindow.setContent("Your current location.");
          			   		infowindow.open(site.nowThen.map, marker);
          			  		results[0].formatted_address= results[0].formatted_address.replace(/ /g,"+");
          			  		$("#urlqs").val("type=address&address="+results[0].formatted_address + "&withoutMedia=false&withoutLoc=false&onlyWithoutLoc=false&updateDays=0&sortOrderM=DISTANCE&sortOrderP=DISTANCE&keywords=");
					  		$("#oldImages").submit();
					  		//console.log(site.nowThen.map.getBounds())
						}
				  	} 
				  	else {
						alert("Geocoder failed due to: " + status);
				  	}
				});
			});
		} 
		else {
  			alert("I'm sorry, but geolocation services are not supported by your browser.");
		}
	},
	clearInfoWindows: function(){
		if (site.nowThen.infoWindowsArray) {
			for (i in site.nowThen.infoWindowsArray) {
				site.nowThen.infoWindowsArray[i].close();
			}
		}
	},
	clearMarkers: function(){
		if (site.nowThen.markersArray) {
			for (i in site.nowThen.markersArray) {
				site.nowThen.markersArray[i].setMap(null);
			}
		}
	},
	setInfoWindows:function(thisMarker,json, imageUrl,locName,locAddress,locDate,lat,lng, assetId) {
		if (locDate=="" || locDate == null) {
			locDate="Unknown"
		}
		var phLink = "http://www.phillyhistory.org/PhotoArchive/Detail.aspx?assetId="+assetId;
		var content = "<div class='info'><div class='text'><strong>" + locName + "</strong><br/><small><strong>Location:</strong> " + locAddress + "</small><br/><small><strong>Date taken: </strong>" + locDate + "</small><br/><small>To purchase a print visit <a href='"+phLink+"' target='_blank'>PhillyHistory.org</a></small></div><div class='shareLink'><label>Share a link to this image:</label> <input id='imgUrl' /></div> <a href='javascript:void(0)' class='close'>X</a></div><img src='http://phillyhistory.org/PhotoArchive/MediaStream.ashx?mediaId="+imageId+"' class='img' />";
		google.maps.event.addListener(thisMarker, 'click', function() {
			site.nowThen.clearInfoWindows();
			$("#large-image").html(content);
			$("#large-image").show('fast');
			$("#large-image .img").click(function(){$("#large-image").hide('fast'); site.nowThen.mapSharedImage=false});
			$("#large-image .close").click(function(){$("#large-image").hide('fast');  site.nowThen.mapSharedImage=false} );
			site.nowThen.setShareLink(lat,lng, assetId);
		});	
	},
	setShareLink:function(lat,lng, assetId){
		var imgUrl = "http://skookul.com/now-and-then/index.php?ll="+lat+","+lng+"&id="+assetId;
		$("#imgUrl").val(imgUrl);
		$("#imgUrl").click(function(){window.prompt ("To copy the link, press Ctrl+C, then Enter.", imgUrl);})
	}
}

var panoramioLayer = new google.maps.panoramio.PanoramioLayer();

$(document).ready(function(){
	if (window.location.href.indexOf("ll=") > -1) {
		site.nowThen.mapSharedImage = true;
		site.nowThen.loadMapSharedImage();
	}
	else {
		site.nowThen.loadMap();
	}
	site.nowThen.setKml();
	//site.nowThen.getUserLocation();
	site.nowThen.resetMarkers();
	google.maps.event.addListener(site.nowThen.map, 'dragend', function(){site.nowThen.resetMarkers();site.nowThen.mapSharedImage=false});
	panoramioLayer.setMap(site.nowThen.map);
	$(document).keyup(function(e) {
	  if (e.keyCode == 27) {$("#large-image").hide('fast'); site.nowThen.mapSharedImage=false}   // esc
	});
	$("#loader").append(site.nowThen.strLoading);
	$("#loader").show();
	$("#icon-loading-data").show();
});