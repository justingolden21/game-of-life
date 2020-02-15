/*
* Set the current grid state to one where each cell is randomly generated as 1 or 0
* Parameter is the odds that any given cell is 1
*/

function randomizeGrid(oddsLife=0.5) {
	let rows = getRows();
	let cols = getCols();

	for(let x=0; x<rows; x++) {
		for(let y=0; y<cols; y++) {
			grid[x][y] = Math.random() < oddsLife ? 1 : 0;
		}
	}

	updateGrid();
}