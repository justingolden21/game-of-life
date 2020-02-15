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
});


$(document).bind('mousewheel', (evt)=> {
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

$(document).keydown( (evt)=> {
	if(evt.which == 32 || evt.which == 13) { // space, enter
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
});