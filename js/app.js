$(document).foundation();



// MIXES SECTION ################################################################################

// Hide Playlists, dim images and hide audio player
// $('#hyperion-playlist').hide();
/*$('#audio-player-hyperion').hide();*/
// $('#dark-matter-playlist').hide();
/*$('#audio-player-dark-matter').hide();*/
// $('#to-sunrise-playlist').hide();
/*$('#audio-player-to-sunrise').hide();*/
$('#audio-player-push').hide();
$('#playlist').hide();
// $('#mixes img').fadeTo('fast',0.5);
$('#pause').hide();


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
		console.log('setting audio');
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
}

function setAudio(link) {
	audio = new Audio(link);
	return audio;
}

$('.playlist-image').on("click",function(e){
	//e.preventDefault();
	playlist = $(this).next('ul').html();
	console.log(playlist);
	player = $(this).siblings('div').attr('id');
	//console.log(playlist);
	//console.log(player);
	loadPlaylist(playlist, player);
});

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
	console.log($(this));
	audio.play();
	$('#play').hide();
	$('#pause').show();
	$('#duration').fadeIn(400);
	showDuration();
});

//Pause Button
$('body').on('click', '#pause', function(e){
	//e.preventDefault();
	console.log($(this));
	audio.pause();
	$('#pause').hide();
	$('#play').show();
});

//Stop Button
$('body').on('click', '#stop', function(e){
	//e.preventDefault();
	console.log($(this));
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
$('body').on('click', '#playlist li', function(){
    audio.pause();
    initAudio($(this));
	$('#play').hide();
	$('#pause').show();
	$('#duration').fadeIn(400);
	audio.play();
	showDuration();
});

//Volume Control
/*$('#volume').change(function(){
	console.log('changed');
	value = $(this).val();
	audio.volume = parseFloat(value / 10);
});*/

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
	// $('#playlist-dropdown').addClass("pull-me");
	$('#playlist').slideToggle('slow');
});

// Progress Bar Select
$("#progressbar").mouseup(function(e){
    var leftOffset = e.pageX - $(this).offset().left;
    var songPercents = leftOffset / $('#progressbar').width();
	audio.currentTime = songPercents * audio.duration;
});﻿

//Play Next Song
$(audio).on("ended",function(){
    audio.pause();
    var next = $('#playlist li.active').next();
    if (next.length == 0) {
        next = $('#playlist li:first-child');
    }
    initAudio(next);
 	audio.play();
	showDuration();
});﻿