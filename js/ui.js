/*
* Scripts that control the user interface (other than clicking the canvas)
* Buttons, scrolling, and keyboard are handled here
* As well as the functions called such as controlling the generation speed or grid zoom
*/

let paused = true;
let interval;

$( ()=> {
	$('[data-toggle="popover"]').popover({trigger:'hover', placement:'bottom'});

	$('#play-btn').click( ()=> {
		paused = !paused;
		if(paused) {
			$('#play-btn').html('<i class="fas fa-play"></i>');
			clearInterval(interval);
		}
		else {
			$('#play-btn').html('<i class="fas fa-pause"></i>');
			interval = setInterval(doTick, speed);
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

	$('#display-mode-select').change( ()=> {
		displayMode = 'none';
		updateGrid();

		displayMode = $('#display-mode-select').val();
		updateGrid();

		updateDisplayDescription();
	});

	updateDisplayDescription();

	$('#reset-settings-btn').click( ()=> {
		resetSpeed();

		$('#hover-checkbox').prop('checked', false);
		$('#keyboard-checkbox').prop('checked', true);
		$('#gridline-switch').prop('checked', true).change();
		$('#display-mode-select').val('life').change();
	});

	$('#gridline-switch').change( ()=> {
		let color = $('#gridline-switch').is(':checked') ? 'Dark' : 'Light';
		$('label[for=gridline-switch]').html(color + ' gridlines');			

		drawGrid();
		updateGrid();
	});

	$('#fullscreen-btn').click(toggleFullscreen);
});


$(document).bind('mousewheel', (evt)=> {
	if($('.modal').is(':visible') ) return;

	if(evt.originalEvent.wheelDelta / 120 > 0) { // scroll up
		zoomIn();
	}
	else { // scroll down
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

const DISPLAY_DESCRIPTIONS = {
	none: 'No added colors, just black and white',
	fade: 'Show the previous generation in a lighter color',
	life: 'Cells adjacent to live tiles light up in color based upon how many live neighbors they have',
};
function updateDisplayDescription() {
	$('#display-description').html(DISPLAY_DESCRIPTIONS[displayMode]);
}

// https://gist.github.com/demonixis/5188326
function toggleFullscreen(evt) {
	let element = document.documentElement;
	if(evt instanceof HTMLElement) {
		element = evt;
	}
	let isFullscreen = document.webkitIsFullScreen || document.mozFullScreen || false;
	element.requestFullScreen = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || ( ()=> false);
	document.cancelFullScreen = document.cancelFullScreen || document.webkitCancelFullScreen || document.mozCancelFullScreen || ( ()=> false);
	isFullscreen ? document.cancelFullScreen() : element.requestFullScreen();

	if(isFullscreen) { // was fullscreen
		$('#fullscreen-btn').html('<i class="fas fa-expand"></i> Enter Fullscreen');		
	}
	else {
		$('#fullscreen-btn').html('<i class="fas fa-compress"></i> Exit Fullscreen');		
	}
}

// https://stackoverflow.com/a/25876513/4907950
if (document.addEventListener) {
	document.addEventListener('fullscreenchange', fullscreenHandler, false);
	document.addEventListener('mozfullscreenchange', fullscreenHandler, false);
	document.addEventListener('MSFullscreenChange', fullscreenHandler, false);
	document.addEventListener('webkitfullscreenchange', fullscreenHandler, false);
}
function fullscreenHandler() {
	// we don't care if document is or is not in fullscreen
	// we only care that the document has finished changing so we can measure the new innerWidth and innerHeight

	scaleCanvasToWindow();
	drawGrid();
	updateGrid();
}

// function verify(num, min, max, defaultVal) {
// 	num = Math.max(Math.min(parseInt(num),max),min);
// 	return isNaN(num) ? defaultVal : num;
// }

$(document).keydown( (evt)=> {
	if(! $('#keyboard-checkbox').is(':checked') ) return;

	if(evt.which == 32) { // space
		evt.preventDefault();
		$('#play-btn').click();
	}
	if(evt.which == 39) { // right arrow
		evt.preventDefault();
		$('#step-btn').click();
	}
	if(evt.which == 8 || evt.which == 46) { // backspace, delete
		if($('.modal').is(':visible') ) return;
		evt.preventDefault();
		$('#clear-btn').click();
	}

	if(evt.which == 38) { // up
		if(document.activeElement.id!='speed-input') {
			speedUp();
		}
	}
	if(evt.which == 40) { // down
		if(document.activeElement.id!='speed-input') {
			slowDown();
		}
	}
	if(evt.which == 70) { // F
		toggleFullscreen();
	}
});