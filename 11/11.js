let reader = require('fs');
reader.readFile('11_in.txt', (err, data) => {
  if (err) throw err;
  let seatLayout = data.toString().split('\r\n')
    .map(seats => seats.split(""));
  // SeatLayout[row][column]

  // PART ONE
  let seatLayoutCopy = JSON.parse(JSON.stringify(seatLayout));
  console.log("Part One: ", countOccupiedSeats(checkSeats(seatLayoutCopy)));

  // PART TWO
  seatLayoutCopy = JSON.parse(JSON.stringify(seatLayout));
  console.log("Part Two: ", countOccupiedSeats(checkSeats2(seatLayoutCopy)));
});

function checkSeats(array) {
  let changed = true;
  while (changed) {
    changed = false;
    let arrayCopy = JSON.parse(JSON.stringify(array));
    for (let x = 0; x < array.length; x++) {
      for (let y = 0; y < array[x].length; y++) {
        if (array[x][y] == "L") {
          if (emptyToOccupied(arrayCopy, [x, y])) { 
            array[x][y] = "#"; 
            changed = true;
          }
        } else if (array[x][y] == "#") {
          if (occupiedToEmpty(arrayCopy, [x, y])) {
            array[x][y] = "L"; 
            changed = true;
          }
        }
      }
    }
  }
  return array;
}

//If a seat is empty (L) and there are 
// no occupied seats adjacent to it, the seat becomes occupied.
function emptyToOccupied(array, index) {
  let [ x, y ] = index;
  // adjacent column check
  for (let i = x - 1 < 0 ? 0 : x - 1; 
    i < array.length && i < x + 2; i++) {
      for (let j = y - 1 < 0 ? 0 : y - 1; 
        j < array[x].length && j < y + 2; j++) {
          if (array[i][j] == "#") return false;
      }
  }
  return true;  
}

// PART ONE
function occupiedToEmpty(array, index) {
  let [ x, y ] = index;
  let occupiedSeats = 0;
  for (let i = x - 1 < 0 ? 0 : x - 1; 
    i < array.length && i < x + 2; i++) {
      for (let j = y - 1 < 0 ? 0 : y - 1; 
        j < array[x].length && j < y + 2; j++) {
          if (array[i][j] == "#") { 
            occupiedSeats++;
          }
          if (occupiedSeats > 4) return true;
      }
  }
  return false;
}

function countOccupiedSeats(array) {
  return array.map(row => row.filter(seat => seat == "#")
  .join(""))
  .join("")
  .length;
}

function printSeatLayout(array) {
  array.map(row => {
    console.log(row.join(""));
  })
  return "";
}

// PART TWO
function checkSeats2(array) {
  let changed = true;
  let count = 0;
  while (changed) {
    changed = false;
    let arrayCopy = JSON.parse(JSON.stringify(array));
    for (let x = 0; x < array.length; x++) {
      for (let y = 0; y < array[x].length; y++) {
        let adjacentSeats = getAdjacentSeats(arrayCopy, [x, y]);
        if (x == 0 && count == 1) console.log({x, y, adjacentSeats});
        if (array[x][y] == "L") {
          if (emptyToOccupied2(adjacentSeats)) { 
            array[x][y] = "#"; 
            changed = true;
          }
        } else if (array[x][y] == "#") {
          if (occupiedToEmpty2(adjacentSeats)) {
            array[x][y] = "L"; 
            changed = true;
          }
        }
      }
    }
  }
  return array;
}

function getAdjacentSeats(array, index) {
  let adjacentSeats = [];
  let direction = [ [-1,-1], [-1, 0], [-1, 1],
                    [ 0,-1],          [ 0, 1],
                    [ 1,-1], [ 1, 0], [ 1, 1] ] 
  for (let [x, y] of direction) {
    let seat = ".";
    let quit = false;
    let [ix, iy] = index;
    while(!quit && seat == ".") {
      ix += x;
      iy += y;
      if (ix > -1 && ix < array.length && iy > -1 && iy < array[ix].length ) {
        seat = array[ix][iy];
      } else { 
        quit = true; 
      }
    }
    adjacentSeats.push(seat);
  }
  return adjacentSeats;
}

function emptyToOccupied2(array) {
  return !array.includes("#");
}

function occupiedToEmpty2(array) {
  let count = 0;
  for (let seat of array) {
    if (seat == "#") count++;
    if (count > 4) return true;
  }
  return false;
}