/*
* Basic scripts for controlling core functionality
* Handles user editing cells, setting up the grid, and fillCell() which sets a cell
* The fillCell() function both updates the grid variable and draws the cell on the canvas
*/

let canvas, ctx;

let SIZE = 32;

let grid = [];

let mouseIsDown = false;
$(document).mousedown( ()=>
	mouseIsDown = true
).mouseup( ()=>
	mouseIsDown = false
);

function scaleCanvasToWindow() {
	canvas.setAttribute('width', window.innerWidth);
	canvas.setAttribute('height', window.innerHeight);	
}

$( ()=> {
	canvas = document.getElementById('life-canvas');
	ctx = canvas.getContext('2d');

	scaleCanvasToWindow();

	drawGrid();
	clear();

	canvas.onclick = (evt)=> {
		fillCell(Math.round( (evt.offsetX-SIZE/2)/SIZE), Math.round( (evt.offsetY-SIZE/2)/SIZE), 1);
		if(displayMode=='life') updateGrid();
	}
	canvas.oncontextmenu = (evt)=> {
		evt.preventDefault();
		toggleCell(Math.round( (evt.offsetX-SIZE/2)/SIZE), Math.round( (evt.offsetY-SIZE/2)/SIZE) );
		if(displayMode=='life') updateGrid();
	}
	canvas.onmousemove = (evt)=> {
		// dragging mouse
		let doHover = $('#hover-checkbox').is(':checked');
		if(!mouseIsDown && !doHover) return;
		fillCell(Math.round( (evt.offsetX-SIZE/2)/SIZE), Math.round( (evt.offsetY-SIZE/2)/SIZE), 1);
	}

	$(canvas).bind('touchmove', (e)=> {
		// https://stackoverflow.com/a/61732450
		if(e.type == 'touchstart' || e.type == 'touchmove' || e.type == 'touchend' || e.type == 'touchcancel'){
			let evt = (typeof e.originalEvent === 'undefined') ? e : e.originalEvent;
			let touch = evt.touches[0] || evt.changedTouches[0];
			x = touch.pageX;
			y = touch.pageY;
		} else if (e.type == 'mousedown' || e.type == 'mouseup' || e.type == 'mousemove' || e.type == 'mouseover'|| e.type=='mouseout' || e.type=='mouseenter' || e.type=='mouseleave') {
			x = e.clientX;
			y = e.clientY;
		}

		fillCell(Math.round( (x-SIZE/2)/SIZE), Math.round( (y-SIZE/2)/SIZE), 1);
	});

});

function clear() {
	let rows = getRows();
	let cols = getCols();

	for(let x=0; x<rows; x++) {
		for(let y=0; y<cols; y++) {
			fillCell(x, y, 0);
		}
	}
}

function drawGrid() {
	let rows = getRows();
	let cols = getCols();

	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.beginPath();
	for(let x=0; x<rows; x++) {
		if(grid[x]==undefined) grid[x] = [];
		for(let y=0; y<cols; y++) {
			if(grid[x][y]==undefined) grid[x][y] = 0;
			ctx.rect(x*SIZE, y*SIZE, SIZE, SIZE);
		}
	}
	let color = $('#gridline-switch').is(':checked') ? '#666' : '#fff';
	ctx.strokeStyle = color;
	ctx.stroke();
}

function toggleCell(x, y) {
	fillCell(x, y, grid[x][y] == 0 ? 1 : 0);
}

function fillCell(x, y, val, useNextGrid=false) {
	if(x==-1) x++;
	if(y==-1) y++;

	if(useNextGrid) {
		nextGrid[x][y] = val;
	}
	else {
		grid[x][y] = val;
	}

	ctx.fillStyle = val == 1 ? 'black' : 'white';
	ctx.fillRect(x*SIZE + 1, y*SIZE + 1, SIZE - 2, SIZE - 2);
}

// used to restore/redraw grid after zoom
// also used if using a displayMode other than none
let displayMode = 'life'; // 'none', 'life', or 'fade'
function updateGrid() {
	let rows = getRows();
	let cols = getCols();

	// prev
	if(displayMode=='fade' && prevGrid) {
		for(let x=0; x<rows; x++) {
			for(let y=0; y<cols; y++) {
				if(!prevGrid[x]) continue; // bug fix for zooming out
				ctx.fillStyle = prevGrid[x][y] == 1 ? '#666' : 'white';
				ctx.fillRect(x*SIZE + 1, y*SIZE + 1, SIZE - 2, SIZE - 2);
			}
		}
	}
	
	// current
	for(let x=0; x<rows; x++) {
		for(let y=0; y<cols; y++) {
			if(displayMode=='none') {
				ctx.fillStyle = grid[x][y] == 1 ? 'black' : 'white';
			}
			else if(displayMode=='fade') {
				ctx.fillStyle = grid[x][y] == 1 ? 'black' : 'transparent';				
			}
			else { // 'life'
				if(grid[x][y]==1) {
					ctx.fillStyle = 'black';
				}
				else {
					let adj = getAdjacentCount(x, y);
					let lightness = Math.round(100 - (adj*100/9) );
					// let hue = 0;
					// let hue = Math.round(360*adj/9);
					let hue = Math.round(360 - 360*adj/9);
					ctx.fillStyle = 'hsl('+hue+', 100%, '+lightness+'%)';
				}	
			}

			ctx.fillRect(x*SIZE + 1, y*SIZE + 1, SIZE - 2, SIZE - 2);
		}
	}

}

function getRows() {
	return Math.ceil(canvas.width / SIZE);
}
function getCols() {
	return Math.ceil(canvas.height / SIZE);
}
