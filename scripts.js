let canvas, ctx;

let SIZE = 32;

let grid = [];

let mouseIsDown = false;
$(document).mousedown( ()=> {
	mouseIsDown = true;
}).mouseup( ()=> {
	mouseIsDown = false;
});

$( ()=> {
	canvas = document.getElementById('life-canvas');
	ctx = canvas.getContext('2d');

	canvas.setAttribute('width', window.innerWidth);
	canvas.setAttribute('height', window.innerHeight);

	drawGrid();
	clear();

	canvas.onclick = (evt)=> {
		toggleCell(Math.round( (evt.offsetX-SIZE/2)/SIZE), Math.round( (evt.offsetY-SIZE/2)/SIZE) );
	}
	canvas.oncontextmenu = (evt)=> {
		evt.preventDefault();
		toggleCell(Math.round( (evt.offsetX-SIZE/2)/SIZE), Math.round( (evt.offsetY-SIZE/2)/SIZE) );
	}
	canvas.onmousemove = (evt)=> {
		// dragging mouse
		if(!mouseIsDown) return;
		fillCell(Math.round( (evt.offsetX-SIZE/2)/SIZE), Math.round( (evt.offsetY-SIZE/2)/SIZE), 1);
	}
});

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
	ctx.stroke();
}

function toggleCell(x, y) {
	if(x==-1) x++;
	if(y==-1) y++;

	fillCell(x, y, grid[x][y] == 1 ? 0 : 1);
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
function updateGrid() {
	let rows = getRows();
	let cols = getCols();

	for(let x=0; x<rows; x++) {
		for(let y=0; y<cols; y++) {
			ctx.fillStyle = grid[x][y] == 1 ? 'black' : 'white';
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
