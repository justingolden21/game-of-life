/*
* Encode or decode current grid state
* For use importing or exporting grids
* Converts binary 2d array to base 64 and vice versa
* First 16 binary digits store dimension data
* getEncodedStr() and decodeStr() should be called from outside, others are utility functions
*/

function getEncodedStr() {
	let rows = getRows();
	let cols = getCols();

	// store rows and cols in beginning of string, each 8 bin digits long (max size 255x255)
	// add leading 1 so leading 0s aren't cut off
	let binStr = '1' + padZeros(rows.toString(2),8) + padZeros(cols.toString(2),8);

	for(let x=0; x<rows; x++) {
		for(let y=0; y<cols; y++) {
			if(grid[x][y] != undefined) {
				binStr += grid[x][y];
			}
		}
	}

	// base 64 encoded string
	return btoa( ( (parseBigInt(binStr,2) ) ) );
}

function decodeStr(str) {
	let binStr = parseBigInt(atob(str) ).toString(2);
	binStr = binStr.substring(1); // remove leading 1

	let rows = parseInt(binStr.substring(0,8), 2);
	let cols = parseInt(binStr.substring(8,16), 2);

	let idx = 16; // skip the first 16 digits (used for dimensions)
	for(let x=0; x<rows; x++) {
		for(let y=0; y<cols; y++) {
			// in case current grid is too small
			if(grid[x] != undefined && grid[x][y] != undefined) {
				grid[x][y] = binStr[idx++];
			}
		}
	}

	updateGrid();
}

function padZeros(num, len) {
	num = num.toString();
	return '0'.repeat(len - num.length) + num;
}

// https://stackoverflow.com/a/55681265/4907950
function parseBigInt(str, base=10) {
	base = BigInt(base);
	let bigint = BigInt(0);
	for(let i = 0; i < str.length; i++) {
		let code = str[str.length-1-i].charCodeAt(0) - 48;
		if(code >= 10) code -= 39;
		bigint += base**BigInt(i) * BigInt(code);
	}
	return bigint;
}