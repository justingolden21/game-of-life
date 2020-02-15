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