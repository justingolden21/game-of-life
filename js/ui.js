/*
* Scripts that control the user interface (other than clicking the canvas)
* Buttons, scrolling, and keyboard are handled here
* As well as the functions called such as controlling the generation speed or grid zoom
*/

let paused = true;
let interval;

let SPEED = 200;

$( ()=> {
	$('#play-btn').click( ()=> {
		paused = !paused;
		if(paused) {
			$('#play-btn').html('<i class="fas fa-play"></i>');
			clearInterval(interval);
		}
		else {
			$('#play-btn').html('<i class="fas fa-pause"></i>');
			interval = setInterval(doTick, SPEED);
		}
	});
	$('#step-btn').click(doTick);
	$('#clear-btn').click(clear);

	$('#export-btn').click( ()=> {
		$('#textarea').val(getEncodedStr() );
	});
	$('#import-btn').click( ()=> {
		decodeStr($('#textarea').val() );
	});
	$('#copy-btn').click( ()=> {
		let textarea = $('#textarea');
		textarea.focus();
		textarea.select();
		document.execCommand('copy');
		if(window.innerWidth < 992) { // if mobile then focus copy btn
			$('#copy-btn').focus();
		}
	});
});


$(document).bind('mousewheel', (evt)=> {
	if($('#info-modal').is(':visible') ) return;
	if($('#import-export-modal').is(':visible') ) return;

	if(evt.originalEvent.wheelDelta / 120 > 0) {
		// scroll up
		zoomIn();
	}
	else {
		// scroll down
		zoomOut();
	}
});

const MIN_SIZE = 4;
const MAX_SIZE = 128;

function zoomOut() {
	if(SIZE > 8) {
		SIZE /= 2;
		drawGrid();
		updateGrid();
	}
}

function zoomIn() {
	if(SIZE < 128) {
		SIZE *= 2;
		drawGrid();
		updateGrid();
	}
}

const MIN_SPEED = 50;
const MAX_SPEED = 2000;
const SPEED_INTERVAL = 50;

function speedUp() {
	if(SPEED > MIN_SPEED) {
		SPEED -= SPEED_INTERVAL;
		if(!paused) {
			clearInterval(interval);
			interval = setInterval(doTick, SPEED);
		}
	}
}

function slowDown() {
	if(SPEED < MAX_SPEED) {
		SPEED += SPEED_INTERVAL;
		if(!paused) {
			clearInterval(interval);
			interval = setInterval(doTick, SPEED);
		}
	}
}

// https://gist.github.com/demonixis/5188326
function toggleFullscreen(evt) {
	let element = document.documentElement;

	if(evt instanceof HTMLElement) {
		element = evt;
	}

	let isFullscreen = document.webkitIsFullScreen || document.mozFullScreen || false;

	element.requestFullScreen = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || function () { return false; };
	document.cancelFullScreen = document.cancelFullScreen || document.webkitCancelFullScreen || document.mozCancelFullScreen || function () { return false; };

	isFullscreen ? document.cancelFullScreen() : element.requestFullScreen();


	drawGrid();
	updateGrid();
}

$(document).keydown( (evt)=> {
	if(evt.which == 32) { // space
		evt.preventDefault();
		$('#play-btn').click();
	}
	if(evt.which == 39) { // right arrow
		evt.preventDefault();
		$('#step-btn').click();
	}
	if(evt.which == 8 || evt.which == 46) { // backspace, delete
		evt.preventDefault();
		$('#clear-btn').click();
	}

	if(evt.which == 38) { // up
		speedUp();
	}
	if(evt.which == 40) { // down
		slowDown();
	}
	if(evt.which == 70) { // F
		toggleFullscreen();
	}
});