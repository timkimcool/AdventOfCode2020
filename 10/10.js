let reader = require('fs');
reader.readFile('10_in.txt', (err, data) => {
  if (err) throw err;
  let plugs = data.toString().split('\r\n')
    .sort((a, b) => a - b)
    .map(plug => +plug);
  // add starting plug 0
  plugs.unshift(0);
  // add ending plug last_plug + 3
  plugs.push(plugs[plugs.length - 1] + 3);

  // PART ONE
  console.log("Part One: ", solve(plugs));

  // PART TWO
  console.log("Part Two: ", solve2(plugs));
});

function solve(array) {
  let count1 = 0;
  let count3 = 0;
  for (let i = 0; i < array.length - 1; i++) {
    let diff = array[i + 1] - array[i];
    if (diff == 1) { count1++; } 
    else if (diff == 3) { count3++; }
  }
  return count1 * count3;
}

function solve2(array) {
  /* 
  Noticed pattern of 1, 2, 4, 7, 13, etc... 
  When you increase consecutive numbers (01 > 012 > 0123 > 01234 > 012345)
  Tribonacci number? i = i-1 + i-2 + i-3
  getVal increases array of Tribonacci number as needed
  */
  let val = 1;
  let tribArray = [1, 2, 4];
  let tribNum = 0;
  for (let i = 0; i < array.length - 1; i++) {
    // see how many consecutive numbers are in a row
    if (array[i + 1] - array[i] == 1) {
      tribNum++;
    } else { // when diff is 2 or 3
      
      // ex scenario: [1, 2, 4] => 2 options: 2 present or not present
      if (array[i + 1] - array[i] == 2 && array[i + 2] - array[i + 1] == 2) {
        val = val * 2;
        i++;
      }

      // execute getVal when tribNum is meaningful (not 0 or 1)
      if (tribNum > 1) val = val * getVal(tribArray, tribNum);
      
      tribNum = 0; // reset tribNum
    }
  }
  return val;
}

function getVal(array, i) {
  while (array.length < i) {
    const len = array.length;
    array.push(array[len - 1] + array[len - 2] + array[len - 3]);
  }
  return array[i - 1];
}