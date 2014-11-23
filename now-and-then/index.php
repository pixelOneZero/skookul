<!DOCTYPE html>
<html>
<head>
	<link rel="icon" type="image/gif" href="http://skookul.com/favicon.ico">
	<meta name="description" content="Skookul: Music, Food and the Outdoors in Philadelphia, PA" />
	<meta name="keywords" content="Philadelphia, Philly, Skookul, history, historical photos, historical photographs, old photos, old photographs" />
	<title>Now and Then: Historical and Contemporary Photos of Philadelphia - Skookul.com</title>
	<?php include("../includes/css-js.php"); ?>
	<script type="text/javascript" src="http://maps.googleapis.com/maps/api/js?key=AIzaSyAz-ny_9bW2VkZfL-K7baYnu2Jpqs02hSU&libraries=panoramio&sensor=false"></script>
	<script src="../js/now-and-then-min-v4.js"></script>
	<script src="../js/proj4js/lib/proj4js-combined.js"></script>
</head>
<body id="history">
<div id="wrapper" class="now-and-then">
	<?php include("../includes/header.php"); ?>
	<div id="large-image"></div>
	<div id="loader" style="display:none;position:absolute;width:190px;height:70px;background-color:#fff;top:330px;left:520px;opacity:0.90;z-index:200;text-align:left;"></div>
	<form id="oldImages" style="display:none" action="../includes/ba-simple-proxy.php?url=http://www.phillyhistory.org/PhotoArchive/Thumbnails.ashx&mode=native" method="POST" target="response-frame">
		 <input type="hidden" name="start" value="0" />
		 <input type="hidden" name="limit" value="20" />
		 <input type="hidden" name="noStore" value="true" />
		 <input type="hidden" name="request" value="Images" />
		 <input type="hidden" name="urlqs" id="urlqs" value="type=address&address=Ridge+Av+&+Manayunk+Av&withoutMedia=false&withoutLoc=false&onlyWithoutLoc=false&updateDays=0&sortOrderM=DISTANCE&sortOrderP=DISTANCE&keywords=people" /> 
	</form>
	<form id="oldImage" style="display:none" action="../includes/ba-simple-proxy.php?url=http://phillyhistory.org/PhotoArchive/Details.ashx&mode=native" method="POST" target="response-frame">
		 <input type="hidden" name="assetId" id="assetId" value="" />
	</form>
	<iframe name="response-frame" id="response-frame" style="display:none;" onload="site.nowThen.getThenImages();"></iframe>
	<div id="main_content_section">
		<h2>
			Now &amp; Then: Modern and Historical Images of Philadelphia
		</h2>
		<div class="legend">
			In Philly now?
			<div class="grid-cell">
				<a href="javascript:$('#large-image').hide('fast');site.nowThen.getUserLocation()"> Locate me &raquo;</a>
			</div>
			<br/>
			<div class="or">
				- or -
			</div> 
			<br/>
			Drag the map to discover images.
		</div>
		<div class="legend">
			Map Legend
			<dl>
				<dt>
					<img src="../images/marker.png" valign="middle" class="redMarker" /> :
				</dt>
				<dd>
					Historical image
				</dd>
				<dt>
					<img src="../images/new-images.gif" valign="middle" />:
				</dt>
				<dd>
					Present day images
				</dd>
				<dt>
					<img src="../images/star.png" valign="middle" class="greenStar"  />:
				</dt>
				<dd>
					Your current location (for location-aware web browsers)
				</dd>
			</dl>
		</div>
		<div class="intro legend">
			<h3>
				Image credits
			</h3>
			Historical photographs are provided courtesy of <a href="http://phillyhistory.org" target="_blank">PhillyHistory.org</a>, a project of the Philadelphia Department of Records.  Modern images are provided courtesy of <a href="http://panoramio.com" target="_blank">Panaramio</a>.
		</div>
		<div id="map_canvas"></div>
	</div>
	<?php include("../includes/footer.php"); ?>
</div>
<?php include("../includes/google-analytics.php"); ?>			
</body>
</html>