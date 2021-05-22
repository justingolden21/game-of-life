const DEFAULT_SPEED = 200;
let speed = DEFAULT_SPEED;
const MIN_SPEED = 50;
const MAX_SPEED = 2000;
const SPEED_INTERVAL = 50;

$( ()=> {
	$('#backward-icon').hide();
	$('#forward-icon').hide();

	$('#speed-input').attr('min', MIN_SPEED);
	$('#speed-input').attr('max', MAX_SPEED);
	$('#speed-input').attr('step', SPEED_INTERVAL);

	updateSpeed();

	$('#speed-input').change( ()=> {
		speed = parseInt($('#speed-input').val() );
		updateSpeed();
	});
});

function speedUp() {
	if(speed > MIN_SPEED) {
		speed -= SPEED_INTERVAL;
		updateSpeed();
	}
	$('#forward-icon').fadeIn( ()=> $('#forward-icon').fadeOut() );
	$('#backward-icon').css('display', 'none');
}

function slowDown() {
	if(speed < MAX_SPEED) {
		speed += SPEED_INTERVAL;
		updateSpeed();
	}
	$('#backward-icon').fadeIn( ()=> $('#backward-icon').fadeOut() );
	$('#forward-icon').css('display', 'none');
}

// update functionality and display with current speed variable
function updateSpeed() {
	if(!paused) {
		clearInterval(interval);
		interval = setInterval(doTick, speed);
	}
	$('#speed-input').val(speed);
	$('#speed-text').html(speed);

	let rotation = (speed / (MAX_SPEED - MIN_SPEED) ) * 180 - 90;
	rotation *= -1;
	$('#speed-line').css('transform', 'rotate('+rotation+'deg)');
}

function resetSpeed() {
	speed = DEFAULT_SPEED;
	updateSpeed();
}