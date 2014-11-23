site = {
	setNav: function() {
		$("#header ul li a").each(function(){
			if (location.href.indexOf($(this).attr("href")) > -1) {
				$(this).addClass("active");
			}
		})
	}
}

$(document).ready(function() {
	site.setNav();
});