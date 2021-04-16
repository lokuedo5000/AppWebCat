$(document).ready(function() {
	$('.adsapp').attr('data-url', 'https://3sk7d418al8u.com/h971241v2x?key=97657dc5c81ea8711b95639bcd83a3f3');
	$('.adsapp').click(function(event) {
		var url = $(this).attr('data-url');
		window.open(url, '_blank');
		$(this).hide();
	});
});