site.neighborhoods = {
	map:"",
	markersArray:[],
	neighborhoodArray:[],
	infoWindowsArray:[],
	intGetLocations:"",
	strLoading:"<img src='/images/icon-loading.gif' id='icon-loading-data' style='display:none;position:absolute;top:0;left:270px;z-index:2;' />",
	kmlNeighborhoods:"http://skookul.com/neighborhoods/philadelphia-neighborhoods.kml?uid=1234",
	routeLayer:"",
	historicalSearchTerm:"",
	loadMap: function() {
		var myOptions = {center: new google.maps.LatLng(40.00571681748778,-75.12207493652339),zoom:12,mapTypeId: google.maps.MapTypeId.ROADMAP};
		site.neighborhoods.map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
		site.neighborhoods.setKml();
	},
	setKml:function() {
		//site.neighborhoods.routeLayer = new google.maps.KmlLayer(site.neighborhoods.kmlNeighborhoods,  { map:site.neighborhoods.map, preserveViewport: true});
		//site.neighborhoods.routeLayer.setMap(site.neighborhoods.map);
		//site.neighborhoods.neighborhoodArray.push(site.neighborhoods.routeLayer);
	},
	getThenImages: function(){
		var thenImages = $("#response-frame").contents().text();
		thenImages = thenImages.substring(thenImages.indexOf("{"), thenImages.lastIndexOf("}")+1)
		var json = $.parseJSON(thenImages);
		var output = "";
		if (typeof(json)!="undefined" && json!=null) { 
			imageUrl="";
			locName = "";
			locAddess = "";
			locDate = "";
			$.each(json.images, function(i,images) {
				imageUrl = images.url;
				imageId = imageUrl.substring(imageUrl.indexOf("=")+1, imageUrl.length);
				//console.log(imageId);
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
				//console.log(utm[1] + " " + utm[0])
				var coord1 = new Proj4js.Point(utm[1],utm[0]);
				var coord2 = new Proj4js.Point(utm[0],utm[1]);
				Proj4js.transform(source, dest, coord1);
				Proj4js.transform(source, dest, coord2);
				//console.log(coord1.x + ", " + coord1.y);
				//console.log(coord2.x + ", " + coord2.y);
				var myLatLng = new google.maps.LatLng(coord2.y,coord2.x);
				//console.log("myLatLng is  "+myLatLng );
				var marker = new google.maps.Marker({
					position: myLatLng,
					animation: google.maps.Animation.DROP,
					map: site.neighborhoods.map
				});
				site.neighborhoods.setInfoWindows(marker, json, imageUrl,locName,locAddress,locDate);
				site.neighborhoods.markersArray.push(marker);
			});
			//$("#header").append(output);
			
			
		}
	},
	getNowImages: function(){
		var response = $("#new-response-frame").contents().text();
		response = response.substring(response.indexOf("{"), response.lastIndexOf("}")+1)
		var json = $.parseJSON(response);
		var output = "";
		if (typeof(json)!="undefined" && json!=null) { 
			//console.log(json);
			$.each(json.photos.photo, function(i,photo) {
				imgTag = "<div style='width:110px;padding:5px;border:1px solid #aaa;height:125px;font-size:10px;float:left'><img src='http://farm"+photo.farm+".static.flickr.com/"+photo.server+"/"+photo.id+"_"+photo.secret+"_s.jpg' /></div>";
				output = output + imgTag;
				
				
				var myLatLng = new google.maps.LatLng(photo.lat,photo.lon);
				
				var marker = new google.maps.Marker({
					position: myLatLng,
					animation: google.maps.Animation.DROP,
					map: site.neighborhoods.map
				});
			});
			$("#header").append(output);
			
			
		}
	},
	getPoints:function() {
		var testLatLng = new google.maps.LatLng(40.00571681748778,-75.12207493652339);
		//console.log(site.neighborhoods.map);
		var testPoint =  (site.neighborhoods.map).getProjection().fromLatLngToPoint(testLatLng);
		//console.log(testPoint);
	},
	toggleNeighborhoodKml:function() {
		if (site.neighborhoods.neighborhoodArray.length==0) {
			site.neighborhoods.setKml();
		}
		else
		{
			if (site.neighborhoods.neighborhoodArray) {
				for (i in site.neighborhoods.neighborhoodArray) {
					site.neighborhoods.neighborhoodArray[i].setMap(null);
				}
			}
			site.neighborhoods.neighborhoodArray.length=0;
		}
	},
	attachFormSubmit:function() {
		$("img.form-submit").click(function(){
			site.neighborhoods.historicalSearchTerm = $("#new-images").children("#text").val();
			if ($("#photoType-now").is(":checked")) {
				$("#new-images").submit();
			}
			else
			{
				var urlqs = $("#urlqs");
				var start = urlqs.val().indexOf("&keywords=");
				var keywords = urlqs.val().substring(start,urlqs.val().length);
				urlqs.val().replace(keywords,"");
				//console.log("start="+start+", keywords="+keywords+", new urlqs.val()="+urlqs.val());
				urlqs.val(urlqs.val() + site.neighborhoods.historicalSearchTerm);
				$("#oldImages").submit();
			}
		});
	},
	setHiddenFields:function() {
		$("#new-images").submit(function(){
			$(this).children("#tags").val($(this).children("#text").val());
			
		});
	},
	getUserLocation:function() {
		var infowindow = new google.maps.InfoWindow();
		if (navigator.geolocation) {
  			navigator.geolocation.getCurrentPosition(function(position) {
  				//console.log(position.coords.latitude + " " + position.coords.longitude);
  				 var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
				geocoder = new google.maps.Geocoder();
				geocoder.geocode({'latLng': latlng}, function(results, status) {
				  if (status == google.maps.GeocoderStatus.OK) {
					if (results[0]) {
					  site.neighborhoods.map.setZoom(17);
					  site.neighborhoods.map.setCenter(latlng);
					   var image = '../images/star.png';
					   marker = new google.maps.Marker({
						  position: latlng,
						  map: site.neighborhoods.map,
						  icon:image
					  });
					   infowindow.setContent("Your current location.");
          			   infowindow.open(site.neighborhoods.map, marker);
          			   results[0].formatted_address= results[0].formatted_address.replace(/ /g,"+");
          			  $("#urlqs").val("type=address&address="+results[0].formatted_address + "&withoutMedia=false&withoutLoc=false&onlyWithoutLoc=false&updateDays=0&sortOrderM=DISTANCE&sortOrderP=DISTANCE&keywords=");
					  $("#oldImages").submit();
					}
				  } else {
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
		if (site.neighborhoods.infoWindowsArray) {
		for (i in site.neighborhoods.infoWindowsArray) {
			site.neighborhoods.infoWindowsArray[i].close();
		}
		}
	},
	setInfoWindows:function(thisMarker,json, imageUrl,locName,locAddress,locDate){
		//console.log('setInfoWindow()');
		var infowindow = new google.maps.InfoWindow({
		content: "<img src='http://phillyhistory.org/PhotoArchive/MediaStream.ashx?mediaId="+imageId+"' align='left' style='margin-right:15px' />"+" <strong>Description:</strong> " + locName + "<br/> <strong>Address</strong>: " + locAddress + "<br/> <strong>Date</strong>:" + locDate
		});
		site.neighborhoods.infoWindowsArray.push(infowindow);
		google.maps.event.addListener(thisMarker, 'click', function() {
			site.neighborhoods.clearInfoWindows();
			infowindow.open(site.neighborhoods.map,thisMarker);
		});
	}
}

$(document).ready(function(){
	site.neighborhoods.loadMap();
	site.neighborhoods.attachFormSubmit();
	site.neighborhoods.setHiddenFields();
	site.neighborhoods.getUserLocation();

	//$("#new-images").submit();
	//flickr app api key: 6ee29bff29d6c060fab41b7fb5ab6489
	// secret: 44df08c27322df87
	// test request: URL: http://api.flickr.com/services/rest/?method=flickr.photos.geo.photosForLocation&api_key=703fefb68834ceeb0d7c3b4373ba939d&lat=40.005716&lon=-75.122074&accuracy=3&format=json&auth_token=72157629427405311-c5b385199397bb64&api_sig=3432de4513580ea0bd6b651b9e051f42
	// api method: http://www.flickr.com/services/api/explore/flickr.photos.search
	// OAuth required to receive geotagged photos: http://oauth.net/code/
	// how to link to an image: http://www.flickr.com/services/api/misc.urls.html
	// this json: { "id": "5200831237", "owner": "73272114@N00", "secret": "943fe8f99e", "server": "4085", "farm": 5, "title": "There's Nothing On", "ispublic": 1, "isfriend": 0, "isfamily": 0 },
	// yields this image: http://farm5.static.flickr.com/4085/5200831237_943fe8f99e_m.jpg
	// pass the photo id to this method to get lat and lon: http://www.flickr.com/services/api/explore/flickr.photos.geo.getLocation
	
});