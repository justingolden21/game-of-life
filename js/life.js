/*
* Scripts that handle the basic game logic
* The doTick() function loops through and applies the game rules to each cell
* The nextGrid variable is used to hold the future grid generation
* This is so the future grid isn't calcualted by referencing itself
* In other words, everything happens at the same time
*/

let prevGrid;
let nextGrid;

function doTick() {
	let rows = getRows();
	let cols = getCols();

	nextGrid = grid.map( (arr)=> { // deep clone 2d array
		return arr.slice();
	});

	for(let x=0; x<rows; x++) {
		for(let y=0; y<cols; y++) {
			doRules(x, y);
		}
	}

	prevGrid = grid.map( (arr)=> { // deep clone 2d array
		return arr.slice();
	});

	grid = nextGrid.map( (arr)=> { // deep clone 2d array
		return arr.slice();
	});

	if(displayMode!='none') updateGrid();
}

function doRules(x, y) {
	let adjacentCount = getAdjacentCount(x, y);

	if(adjacentCount == 3 && grid[x][y] == 0) {
		// 1. a dead cell with 3 neighbors becomes alive
		fillCell(x, y, 1, true);
	}
	else if(adjacentCount > 1 && adjacentCount < 4 && grid[x][y] == 1) {
		// 2. a living cell with 2 or 3 neighbors stays alive
		fillCell(x, y, 1, true);
	}
	else {
		// 3. in any other case the cell dies
		fillCell(x, y, 0, true);
	}
}

function getAdjacentCount(x, y) {
	let count = 0;
	if(x > 0 && y > 0 && grid[x-1][y-1] == 1) count++;
	if(x > 0 && grid[x-1][y] == 1) count++;
	if(x > 0 && y < grid[x].length-1 && grid[x-1][y+1] == 1) count++;

	if(y > 0 && grid[x][y-1] == 1) count++;
	if(y < grid[x].length-1 && grid[x][y+1] == 1) count++;

	if(x < grid.length-1 && y > 0 && grid[x+1][y-1] == 1) count++;
	if(x < grid.length-1 && grid[x+1][y] == 1) count++;
	if(x < grid.length-1 && y < grid[x].length+1 && grid[x+1][y+1] == 1) count++;

	return count;
}