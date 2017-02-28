$(document).foundation();


// MIXES SECTION ################################################################################


$('#audio-player-push').hide();
$('#playlist').hide();
$('#pause').hide();
$('.hidden').hide();
$('#duration').html('0.00');


// Cover highlight when hover
$('#mixes img').mouseenter(function() {
   	$(this).fadeTo('fast',1);
});
$('#mixes img').mouseleave(function() {
   $(this).fadeTo('fast',0.5);
});


// AUDIO PLAYER SECTION ################################################################################

var audio;

//Hide Pause Initially
$('#pause').hide();

//Initializer - Play First Song
// initAudio($('#playlist li:first-child'));

function initAudio(element){
	var song = element.attr('song');
	var title = element.text();
	var cover = element.attr('cover');
	var artist = element.attr('artist');
	var link = element.attr('link');

	//Create a New Audio Object
	// audio = new Audio('media/' + song);

	if(typeof(audio) != 'object') {
		// console.log('setting audio');
		audio = setAudio(link);
	}
	audio.pause();
	audio = setAudio(link);

	//Insert Duration
	if(!audio.currentTime){
		$('#duration').html('0.00');
	}

	//Insert Artist & Title
	$('#audio-player .song').text(song);
	$('#audio-player .artist').text(artist);

	//Insert Cover Image
	//$('img.cover').attr('src','images/covers/' + cover);

	//Add active class to selected song
	$('#playlist li').removeClass('active');
	element.addClass('active');

	//Play Next Track (Steff)
	$(audio).on('ended', function(){
     	// $('#next').trigger('click');
     	audio.pause();
	    var next = $('#playlist li.active').next();
	    if (next.length == 0) {
	        next = $('#playlist li:first-child');
	    };
	    initAudio(next);
	 	audio.play();
		showDuration();
  	});
}


//Connect to Song Link
function setAudio(link) {
	audio = new Audio(link);
	return audio;
}


//Click Image to connect track meta-data
$('.playlist-image').on("click",function(e){
	//e.preventDefault();
	playlist = $(this).next('ul').html();
	player = $(this).siblings('div').attr('id');
	//console.log(player);
	loadPlaylist(playlist, player);
});


//Loads playlist
function loadPlaylist(playlist, player){
	$('#playlist').html(playlist);
	loadPlayer(player);
}

function loadPlayer(player){
	$('#'+player).html($('#audio-player-push'));
 	$('#audio-player-push').show();
 	playTracks();
}

function playTracks() {
	initAudio($('#playlist li:first-child'));
	audio.play();
	showDuration();
	$('#play').hide();
	$('#pause').show();
}


//Play Button
$('body').on('click', '#play', function(e){
	//e.preventDefault();
	audio.play();
	$('#play').hide();
	$('#pause').show();
	$('#duration').fadeIn(400);
	showDuration();
});


//Pause Button
$('body').on('click', '#pause', function(e){
	//e.preventDefault();
	audio.pause();
	$('#pause').hide();
	$('#play').show();
});


//Stop Button
$('body').on('click', '#stop', function(e){
	//e.preventDefault();
	audio.pause();
	// audio.currentTime = 0;
	initAudio($('#playlist li:first-child'));
	$('#pause').hide();
	$('#play').show();
	$('#duration').fadeOut(400);
});


//Next Button
$('body').on('click', '#next', function(){
	audio.pause();
	var next = $('#playlist li.active').next(); 
	if (next.length == 0) {
		next = $('#playlist li:first-child');
	}
	initAudio(next);
	audio.play();
	showDuration();
	$('#play').hide();
	$('#pause').show();
});


//Prev Button
$('body').on('click', '#prev', function(){
	audio.pause();
	var prev = $('#playlist li.active').prev();   
	if (prev.length == 0) {
		prev = $('#playlist li:last-child');
	}
	initAudio(prev);
	audio.play();
	showDuration();
	$('#play').hide();
	$('#pause').show();
});


//Playlist Song Click
// $('#playlist li').click(function () {
$('body').on('click', '#mixes #playlist li', function(){
    audio.pause();
    initAudio($(this));
	$('#play').hide();
	$('#pause').show();
	$('#duration').fadeIn(400);
	audio.play();
	showDuration();
});


//Volume Control
$('.slider').on('moved.zf.slider', function() {	
	volume = $('#volume').val();
	audio.volume = parseFloat(volume / 10);
});


//Time Duration
function showDuration(){
	$(audio).bind('timeupdate', function(){
		//Get hours and minutes
		var s = parseInt(audio.currentTime % 60);
		var m = parseInt((audio.currentTime / 60) % 60);
		//Add 0 if seconds less than 10
		if (s < 10) {
			s = '0' + s;
		}
		$('#duration').html(m + '.' + s);
		var value = 0;
		if (audio.currentTime > 0) {
			value = Math.floor((95 / audio.duration) * audio.currentTime);
		}
		$('#progress').css('width',value + '%');
	});
}

//Dropdown Menu
$('.pull-me').click(function(){
	$('#playlist').slideToggle('slow');
});

//Progress Bar Select
$("#progressbar").mouseup(function(e){
    var leftOffset = e.pageX - $(this).offset().left;
    var songPercents = leftOffset / $('#progressbar').width();
	audio.currentTime = songPercents * audio.duration;
});﻿



// INDIVIDUAL TRACK SECTION ################################################################################


// To Add Track #######################
$(".dnb-track").on("click",function(e){
	track = $(this).next('ul').html();
	loadPlaylist1(track);
	$('#playlist').show();
	$('.pull-me').show();
	// $(this).hide();
});

function loadPlaylist1(playlist){
	$('#playlist').append(track);
	// console.log($('#playlist-button li.length'));
	playTracks1();
};

function playTracks1() {
	if($("#playlist li").length == 1){
		initAudio($('#playlist li:first-child'));
		audio.play();
		showDuration();
		$('#play').hide();
		$('#pause').show();
	}
}

// Select Track From Playlist #######################
$('body').on('click', '#drumnbass #playlist li .track-select', function(){
    audio.pause();
    initAudio($(this).parent('li'));
	$('#play').hide();
	$('#pause').show();
	$('#duration').fadeIn(400);
	audio.play();
	showDuration();
});

// Remove Track From Playlist #######################################################################
$('body').on('click', '.remove-button', function(){
	if ($(this).parent('div').parent('li').hasClass("active")) {
		audio.pause();
		$(this).parent('div').parent('li').remove();
		var next = $('#playlist li.active').next(); 
		if (next.length == 0) {
			next = $('#playlist li:first-child');
		}
		initAudio(next);
		audio.play();
		showDuration();
		$('#play').hide();
		$('#pause').show();
	}
	else {
		$(this).parent('div').parent('li').remove();
	};
});

// Show / Hide Library Sections #######################################################################
$('body').on('click', '#dnb-aggressive-button-show', function(){
	$('#dnb-aggressive-list').show('slow');
	$('#dnb-aggressive-button-show').hide();
	$('#dnb-aggressive-button-hide').show();
});
$('body').on('click', '#dnb-aggressive-button-hide', function(){
	$('#dnb-aggressive-list').hide('slow');
	$('#dnb-aggressive-button-show').show();
	$('#dnb-aggressive-button-hide').hide();
});


$('body').on('click', '#dnb-dark-button-show', function(){
	$('#dnb-dark-list').show('slow');
	$('#dnb-dark-button-show').hide();
	$('#dnb-dark-button-hide').show();
});
$('body').on('click', '#dnb-dark-button-hide', function(){
	$('#dnb-dark-list').hide('slow');
	$('#dnb-dark-button-show').show();
	$('#dnb-dark-button-hide').hide();
});

$('body').on('click', '#dnb-upbeat-button-show', function(){
	$('#dnb-upbeat-list').show('slow');
	$('#dnb-upbeat-button-show').hide();
	$('#dnb-upbeat-button-hide').show();
});
$('body').on('click', '#dnb-upbeat-button-hide', function(){
	$('#dnb-upbeat-list').hide('slow');
	$('#dnb-upbeat-button-show').show();
	$('#dnb-upbeat-button-hide').hide();
});

$('body').on('click', '#dnb-melodic-button-show', function(){
	$('#dnb-melodic-list').show('slow');
	$('#dnb-melodic-button-show').hide();
	$('#dnb-melodic-button-hide').show();
});
$('body').on('click', '#dnb-melodic-button-hide', function(){
	$('#dnb-melodic-list').hide('slow');
	$('#dnb-melodic-button-show').show();
	$('#dnb-melodic-button-hide').hide();
});







