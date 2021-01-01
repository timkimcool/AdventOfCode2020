  let reader = require('fs');
reader.readFile('23_in.txt', (err, data) => {
  if (err) throw err;
  let arr = data.toString().split('')
    .map(x => +x);
  // PART ONE
  console.log('Part One: ', doMovesLL([...arr], 9, 100))
  // PART TWO
  console.log('Part Two: ', doMovesLL2([...arr], 1000000, 10000000))

});

function createLL(arr, size) {
  let llArr = [];
  let llMap = {};
  arr.map(val => {
    llArr.push({
      'value': val,
      'right': undefined,
      'left': undefined,
    });
    llMap[val] = llArr[llArr.length - 1];
  });

  for (let i = arr.length + 1; i <= size; i++) {
    llArr.push({
      'value': i,
      'right': undefined,
      'left': undefined,
    })
    llMap[i] = llArr[llArr.length - 1];
  }

  llArr.forEach((cup, i) => {
    cup['right'] = llArr[(i + 1 < llArr.length ? i + 1 : 0)];
    cup['left'] = llArr[(i - 1 < 0 ? llArr.length - 1 : i - 1)];
  })

  return [ llArr, llMap ];
}

function doMovesLL(arr, size, times) {
  let [ llArr, llMap ] = createLL(arr, size);
  let curCup = llArr[0];
  for (let i = 0; i < times; i++) {
    curCup = doMoveLL(curCup, llMap, size)
  }
  let ret = getValueArr(llMap['1']);
  return ret.join('').slice(0, -1);
}

function doMovesLL2(arr, size, times) {
  let [ llArr, llMap ] = createLL(arr, size);
  let curCup = llArr[0];
  for (let i = 0; i < times; i++) {
    curCup = doMoveLL(curCup, llMap, size)
  }
  let ret = getValueArr(llMap['1']);
  return ret[0] * ret[1];
}

function doMoveLL(curCup, llMap, maxVal) {
  let destCup = llMap[destCupValue(curCup, maxVal)];
  insert3Cup(destCup, curCup, [ curCup['right'], 
  curCup['right']['right'], curCup['right']['right']['right'] ]);
  return curCup['right'];
}

function destCupValue(curCup, maxVal) {
  destCupVal = curCup['value'] - 1;
  let found = false;
  while (!found) {
    found = true;
    if (destCupVal === 0) destCupVal += maxVal;
    let cup = curCup;
    for (let i = 0; i < 3; i++) {
      cup = cup['right'];
      if (destCupVal === cup.value) {
        found = false;
        destCupVal--;
        break;
      }
    }
  }
  return destCupVal;
}

function insert3Cup(destCup, curCup, cups) {
  curCup['right'] = cups[2]['right'];
  cups[0]['left'] = destCup;
  let destCupRight = destCup['right']; 
  destCup['right'] = cups[0];
  destCup['left'] = curCup;
  
  destCupRight['left'] = cups[2];
  cups[2]['right'] = destCupRight
  
}

function getValueArr(curCup) {
  let oriVal = curCup['value'];
  let curVal = '';
  let arr = [];
  while (oriVal != curVal) {
    curCup = curCup['right'];
    curVal = curCup['value'];
    arr.push(curVal);
  }
  return arr;
}