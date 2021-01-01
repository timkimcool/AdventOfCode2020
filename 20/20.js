let reader = require('fs');
reader.readFile('20_in.txt', (err, data) => {
  if (err) throw err;
  let tilesObj = {};
  let tiles = data.toString().split('\r\n\r\n')
    .map(tile => tile.split('\r\n'));
  
  tilesObj = tilesToObj(tiles);
  let arr;
  [ arr, tilesObj] = makeBorder(tilesObjToArr(tilesObj), tilesObj);

  // PART ONE
  console.log("Part One: ", multCorners(arr));

  // PART TWO
  picArr = puzzleToPic(arr, tilesObj);
  console.log("Part Two: ", countHash(picArr) - findMonsterHash(picArr));
});

function countHash(arr) {
  return arr.reduce((acc, cur) => {
    let count = 0;
    for (let i = 0; i < cur.length; i++) {
      if (cur[i] === '#') count++;
    }
    return acc + count;
  }, 0);
}

function findMonsterHash(arr) {
  let line1 = new RegExp(/..................#./);
  let line2 = new RegExp(/#....##....##....###/);
  let line3 = new RegExp(/.#..#..#..#..#..#.../);
  let line1Flip = new RegExp(/.#................../);
  let line2Flip = new RegExp(/###....##....##....#/);
  let line3Flip = new RegExp(/...#..#..#..#..#..#./);
  let count = 0;
  while (count === 0) {
    for (let i = 1; i < arr.length; i++) {
      let line = arr[i];
      while (line.search(line2) !== -1 || line.search(line2Flip) !== -1) {
        if (count === 0) {
          if (arr[i - 1].search(line1Flip) !== -1 &&
            arr[i + 1].search(line3Flip) !== -1) {
            line2 = /a/;
          } else if (arr[i - 1].search(line1) !== -1 &&
            arr[i + 1].search(line3) !== -1) {
            line2Flip = /a/;
          }
        }
        if (arr[i - 1].search(line1Flip) !== -1 &&
          arr[i + 1].search(line3Flip) !== -1) {
            count++;
            line = line.slice(line.search(line2Flip) + 1);
        } else {
          break;
        }
      }
    }
    arr = rotateCW(arr);
  }
  return count * 15;
}

function puzzleToPic(arr, tilesObj) {
  let pictureArr = [];
  arr.map(arrLine => {
    let lineCount = pictureArr.length;
    arrLine.map((tile, i) => {
      let tempArr = tilesObj[tile]['array'];
      tempArr.shift();
      tempArr.pop();
      tempArr.map((line, j) => {
        line = line.slice(1, -1);
        pictureArr[lineCount + j] = pictureArr[lineCount + j] === undefined ?
          line : pictureArr[lineCount + j] += line;
      })
    }); 
  });
  return pictureArr;
}

function multCorners(arr) {
  let xMax = arr[0].length - 1;
  let yMax = arr.length - 1;
  return +arr[0][0] * +arr[0][xMax] * 
    +arr[yMax][0] * +arr[yMax][xMax];
}

function tilesObjToArr(tilesObj) {
  let arr = [];
  for (let tile in tilesObj) {
    arr.push(tile);
  }
  return arr;
}

function tilesToObj(tiles) {
  let tilesObj = {};
  for (let tile of tiles) {
    let tileObj = {};
    let tileNum = tile[0].substring(5,9);
    let array = tile.slice(1);
    tileObj['name'] = tileNum;
    tileObj['array'] = array;
    tileObj = getNESW(tileObj);
    tilesObj[tileNum] = tileObj;
  }
  return tilesObj;
}

function rotateTile(tileObj, times = 1) {
  for (let i = 0; i < times; i++) 
  {
    tileObj['array'] = rotateCW(tileObj['array']);
  }
  tileObj = getNESW(tileObj);
  return tileObj;
}

function rotateCW(arr) {
  let newArr = [];
  arr.map(line => newArr.push(''));
  arr.map(line => {
    for (let j = 0; j < line.length; j++) {
      newArr[j] = line[j] + newArr[j];
    }
  });
  return newArr;
}

function flip(tileObj, flip = 0) {
  if ('NS'.includes(flip)) {
    flip = 1;
  } else {
    flip = 0;
  }
  if (flip === 0) {   // NS
    tileObj['array'] = tileObj['array'].reverse();
  } else {            // WE
    tileObj['array'] = tileObj['array'].map(line => {
      return line.split('').reverse().join('');
    });
  }
  tileObj = getNESW(tileObj);
  return tileObj;
}

function getNESW(tileObj) {
  let array = tileObj['array'];
  tileObj['N'] = array[0];
  tileObj['E'] = array.reduce((acc, cur) => acc + cur[cur.length - 1], '');
  tileObj['S'] = array[array.length - 1];
  tileObj['W'] = array.reduce((acc, cur) => acc + cur[0], '');
  return tileObj;
}

function makeBorder(borderArr, tilesObj) {
  let dir = 'NESW';
  let newTilesObj = {};
  let layoutArr = [ [borderArr[0]] ];
  let oppDir = {
    N: 'S',
    E: 'W',
    S: 'N',
    W: 'E',
  }
  let availSide = {};
  let curTile;
  for (let i = 0; i < dir.length; i++) {
    let curDir = dir[i];
    curTile = tilesObj[borderArr[0]];
    availSide[curTile[curDir]] = [ curTile['name'], dir[i] ];
  }
  newTilesObj[curTile['name']] = curTile;
  borderArr.shift();
  while (borderArr.length > 0) {
    for (let i = 0; i < borderArr.length; i++) {
      curTile = tilesObj[borderArr[i]];
      for (let j = 0; j < dir.length; j++) {
        let str = getMatch(curTile[dir[j]], availSide);
        if (str !== undefined) {
          quit = false;
          let dir0 = availSide[str][1];
          let dir1 = oppDir[dir0];
          let numRotate = getNumRotate(dir1, dir[j]);
          curTile = rotateTile(curTile, numRotate);
          if (str !== curTile[dir1]) {
            curTile = flip(curTile, dir1);
          }
          clayoutArr = addToArr(layoutArr, availSide[str][0], 
            curTile['name'], dir0);
          newTilesObj[curTile['name']] = curTile;
          borderArr.splice(i--, 1);
          for (let k = 0; k < dir.length; k++) {
            availSide[curTile[dir[k]]] = [ curTile['name'], dir[k] ];
          }
          delete availSide[str];
          break;
        }
      }
    }
  }
  return [layoutArr, newTilesObj];
}

function addToArr(arr, tileName0, tileName1, dirAdd) {
  let x;
  let y;
  loop:
  for (let i = 0; i < arr.length; i++) {
    for(let j = 0; j < arr[i].length; j++) {
      if(arr[i][j] === tileName0) {
        y = i;
        x = j;
        break loop;
      }
    }
  }
  switch(dirAdd) {
    case 'N':
      if (y === 0) {
        let newArr = new Array(arr[y].length);
        newArr[x] = tileName1;
        arr.unshift(newArr);
      } else {
        arr[y - 1][x] = tileName1;
      }
      break;
    case 'E':
      if (arr[y].length === x + 1) {
        arr = arr.map(line => {
          line.push('');
          return line
        });
      }
      arr[y][x + 1] = tileName1;
      break;
    case 'S':
      if (arr[y + 1] === undefined) {
        let newArr = new Array(arr[y].length);
        newArr[x] = tileName1;
        arr.push(newArr);
      } else {
        arr[y + 1][x] = tileName1;
      }
      break;
    case 'W':
      if (x === 0) {
        arr = arr.map(line => {
          line.unshift('');
          return line;
        });
        x = 1;
      }
      arr[y][x - 1] = tileName1;
      break;
  }
  // console.log({arr}, tileName1, dirAdd, tileName0);
  return arr;
}

function getMatch(str, availSide) {
  let reverse = str.split('').reverse().join('');
  if (availSide[str] !== undefined) {
    return str;
  }
  if (availSide[reverse] !== undefined) {
    return reverse;
  }
  return undefined;
}

// dir1 to dir0
function getNumRotate(dir0, dir1) {
  let dir = 'NESW';
  let numRotate = dir.indexOf(dir0) - dir.indexOf(dir1);
  return numRotate < 0 ? numRotate + 4 : numRotate;
}


function printArray(tileObj) {
  console.log(tileObj['name']);
  for(let line of tileObj['array']) {
    console.log(line);
  }
  // console.log(tileObj['N'], tileObj['S']);
}

function findOuterBorder(tilesObj) {
  let borderObj = {};
  let dir = 'NESW';
  for (let tileNum in tilesObj) {
    let tile = tilesObj[tileNum];
    for (let i = 0; i < dir.length; i++) {
      let reverseBor = tile[dir[i]].split('').reverse().join('');
      if (borderObj[tile[dir[i]]] === undefined &&
        borderObj[reverseBor] === undefined) {
          borderObj[tile[dir[i]]] = [ tile['name'], dir[i] ];
      } else {
        if (borderObj[tile[dir[i]]] === undefined) {
          delete borderObj[reverseBor];
        } else { delete borderObj[tile[dir[i]]] }
      }
    }
  }
  console.log(borderObj);
  let set = new Set();
  for (let tile in borderObj) {
    set.add(borderObj[tile][0]);
  }
  return Array.from(set);
}