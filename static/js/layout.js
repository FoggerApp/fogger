$(function(){
	var value = $('#navbar .dropdown-menu').children().first().children().first().attr('href');
	
	if(value.match(/user\/profile/)){
	
		$('#navbar .dropdown-menu').children().first().children().first().attr('href', value.replace(/user\/profile/, "profile"));
	}
});