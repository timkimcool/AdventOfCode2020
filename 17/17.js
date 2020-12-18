let reader = require('fs');
reader.readFile('17_in.txt', (err, data) => {
  if (err) throw err;
  let input = data.toString().split('\r\n').join('');

  // PART ONE
  let dim = { 'x': null, 'y': null, 'z': 0 };
  console.log("Part One: ", countActive(initializeGrid({}, input, dim), 6));

  // PART TWO
  dim = { 'x': null, 'y': null, 'z': 0, 'w': 0 };
  console.log("Part Two: ", countActive(initializeGrid({}, input, dim), 6));
});

function countActive(gridObj, times) {
  for (let i = 0; i < times; i++) {
    cycle(gridObj);
    console.log(i);
  }

  let count = 0;
  for (const grid in gridObj) {
    if (gridObj[grid] === '#') count++;
  }
  return count;
}

function initializeGrid(gridObj, input, dim) {
  let side = Math.sqrt(input.length);
  
  let start = [];
  let end = [];
  let index = 0;
  for (const coord in dim) {
    if (dim[coord] === null) {
      start.push(-Math.floor(side/2));
      end.push(+Math.floor((side - 1)/2));
    } else {
      start.push(0);
      end.push(0);
    }
    dim[coord] = index++;
  }
  gridObj['start'] = start;
  gridObj['end'] = end;

  // populate grid coordinate
  let arr = [];
  for (const coord in dim) {
    let startCoord = gridObj['start'][dim[coord]];
    let endCoord = gridObj['end'][dim[coord]]
    let cut = arr.length > 0 ? arr.length : 0;
    for (let i = startCoord; i <= endCoord; i++) {
      if (cut > 0) {
        for ( let j = 0; j < cut; j++) {
          arr.push(arr[j] + "|" + i)
        }
      } else {
        arr.push(i);
      }
    }
    arr = arr.slice(cut);
  }

  // populate grid coordinate values
  let halfSide = Math.floor(side/2);
  for (let i = 0; i < arr.length; i++) {
    let dim = arr[i].split('|');
    setArrayVal(gridObj, input[(+dim[0] + halfSide) + (+dim[1] + halfSide) * side], dim);
  }
  return gridObj;
}

function setArrayVal(gridObj, val, dim) {
  gridObj[indexFormat(dim)] = val;
}

function getArrayVal(gridObj, str) {
  return gridObj[str];
}

function indexFormat(dim) {
  let str = dim[0];
  for (let i = 1; i < dim.length; i++) {
    str += "|" + dim[i];
  }
  return str;
}

function cycle(gridObj) {
  gridObj['start'] = gridObj['start'].map(i => --i);
  gridObj['end'] = gridObj['end'].map(i => ++i);

  let tmpActObj = {};
  getActCountObj(gridObj, 0, '', tmpActObj);

  for(const index in tmpActObj) {
    if (gridObj[index] === '#' && tmpActObj[index] === 2) {
      continue; // already set to #
    } else if (tmpActObj[index] === 3) {
      gridObj[index] = '#';
    } else {
      gridObj[index] = '.';
    }
  }
}

function getActCountObj(gridObj, index = 0, str = '', tmpActObj = {}) {
  if (index != gridObj['start'].length - 1) {
    for(let i = gridObj['start'][index]; i <= gridObj['end'][index]; i++) {
      let newStr = index === 0 ? i : str + '|' + i;
      getActCountObj(gridObj, index + 1, newStr, tmpActObj)
    }
  } else {
    for(let i = gridObj['start'][index]; i <= gridObj['end'][index]; i++) {
      let newStr = str + '|' + i;
      tmpActObj[newStr] = activeNeighbors(gridObj, newStr, newStr);
    }
  }
}

function activeNeighbors(gridObj, strOrig, str, index = 0) {
  let count = 0;
  if (index !== gridObj['start'].length - 1) {
    for (let i = -1; i < 2; i++) {
      let newStr = str.split('|');
      newStr[index] = +newStr[index] + i;
      count += activeNeighbors(gridObj, strOrig, newStr.join('|'), index + 1)
    }
  } else {
    for (let i = -1; i < 2; i++) {
      let newStr = str.split('|');
      newStr[index] = +newStr[index] + i;
      if (strOrig === newStr.join('|')) continue;
      if (getArrayVal(gridObj, newStr.join('|')) === '#') count++;
    }
  }
  return count;
}

function print(gridObj, index = gridObj['start'].length, str = '') {
 if (index !== 1) {
  for (let i = gridObj['start'][index - 1]; i <= gridObj['end'][index - 1]; i++) {
    if (index === gridObj['start'].length) {
      print(gridObj, index - 1, i);
    } else {
      print(gridObj, index - 1, i + '|' +str);
    }
  }
 } else {
  let prt = ''
  for (let i = gridObj['start'][index - 1]; i <= gridObj['end'][index - 1]; i++) {
    prt += getArrayVal(gridObj, i + '|' +str);
  }
  console.log(prt);
 }
}