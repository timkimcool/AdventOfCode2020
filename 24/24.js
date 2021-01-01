  let reader = require('fs');
reader.readFile('24_in.txt', (err, data) => {
  if (err) throw err;
  let tiles = data.toString().split('\r\n');
  
  let dirObj = {
    'e': [2, 0],
    'se': [1, -1],
    'sw': [-1, -1],
    'w': [-2, 0],
    'nw': [-1, 1],
    'ne': [1, 1],
  }

  // PART ONE
  console.log('Part One: ', blackTiles(tiles, dirObj));
  // PART TWO
  console.log("Part Two: ", days(tiles, dirObj, 100));

});

function blackTiles(tiles, dirObj, floorObj) {
  return countBlack(flipTiles(tiles, dirObj, floorObj));
}

function flipTiles(tiles, dirObj) {
  let floorObj = {};
  tiles.map(tile => {
    let coord = [0, 0];
    let dirArr = parseDir(tile, dirObj);
    dirArr.map(dir => coord = [+coord[0] + +dirObj[dir][0], 
      +coord[1] + +dirObj[dir][1]]);
    flip(coord, floorObj);
  }); 
  return floorObj;
}

function flip(coord, floorObj) {
  if (floorObj[coord] === undefined) {
    floorObj[coord] = 'b';
  } else {
    floorObj[coord] = floorObj[coord] === 'w' ? 'b' : 'w';
  }
}

function parseDir(str, dirObj) {
  let arr = [];
  let dir = '';
  for (let i = 0; i < str.length; i++) {
    dir += str[i];
    if (dirObj[dir] !== undefined) {
      arr.push(dir);
      dir = '';
    };
  }
  return arr;
}

function countBlack(floorObj) {
  let count = 0;
  for(let coord in floorObj) {
    if (floorObj[coord] === 'b') count++;
  }
  return count;
}

function days(tiles, dirObj, times) {
  let floorObj = {};
  let enclosedTiles = {};
  floorObj = flipTiles(tiles, dirObj, floorObj);
  for (let i = 0; i < times; i++) {
    floorObj = day(floorObj, dirObj, enclosedTiles);
  }
  return countBlack(floorObj);
}

function day(floorObj, dirObj, enclosedTiles) {
  let expandedFloor = {};
  let newFloor = {};
  let count;
  expandedFloor = expandFloor(floorObj, dirObj, enclosedTiles);
  for (let tile in expandedFloor) {
    count = countSides(tile, dirObj, expandedFloor);
    if (expandedFloor[tile] === 'b') {
      newFloor[tile] = (count === 0 || count > 2) ? 'w' : 'b';
    } else {
      newFloor[tile] = (count === 2) ? 'b' : 'w';
    }
  };
  return newFloor;
}

function countSides(tileCoord, dirObj, floorObj) {
  let coord = tileCoord.split(',').map(x => +x);
  let count = 0;
  for (let dir in dirObj) {
    if (floorObj[[coord[0] + +dirObj[dir][0], 
    coord[1] + +dirObj[dir][1]]] === 'b') count++;
  }
  return count;
}

function expandFloor(floorObj, dirObj, enclosedTiles) {
  let expandedFloor = {};
  for (let tile in floorObj) {
    expandedFloor[tile] = floorObj[tile];
    if (enclosedTiles[tile] !== undefined) continue;
    enclosedTiles[tile] = 1;
    let coord = tile.split(',').map(x => +x);
    for (let dir in dirObj) {
      newCoord = [coord[0] + +dirObj[dir][0], 
      coord[1] + +dirObj[dir][1]];
      if (floorObj[newCoord] === undefined) {
        expandedFloor[newCoord] = 'w'
      } else {
        expandedFloor[newCoord] = floorObj[newCoord];
      }
    }
  }
  return expandedFloor;
}