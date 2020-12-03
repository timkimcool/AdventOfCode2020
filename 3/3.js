
const { strict } = require('assert');
let reader = require('fs');
reader.readFile('3_in.txt', (err, data) => {
  if (err) throw err;

  let line = 0;
  let arr = data.toString()
    .split('\r\n')
    .map(ele => {
      line++;
      return {
        spec: {ele, line},
      };
    })
  
  // PART ONE
  console.log("Part One: ", solve(arr, 3, 1));

  // PART TWO
  console.log("Part Two: ", solve(arr, 1, 1) * solve(arr, 3, 1) * 
    solve(arr, 5, 1) * solve(arr, 7, 1) * solve(arr, 1, 2));
   
  // Alternate answer
  let arr2 = data.toString().split('\r\n');
  console.log("Part One easy: ", easyLoop(arr2, 3, 1));
  console.log("Part Two easy: ", easyLoop(arr2, 1, 1) * easyLoop(arr2, 3, 1) *
    easyLoop(arr2, 5, 1) * easyLoop(arr2, 7, 1) * easyLoop(arr2, 1, 2));
})

function solve(arr, right, down) {
  return arr.map(ele => isTree(getChar(ele, right, down)))
    .reduce((acc, curr) => curr ? acc + 1 : acc, 0);
}

function getChar({ spec }, right, down) {
  let line = spec.line
  if ((down >= line) || (down != 1 && line % down != 1)) return '.'; // skip first lines || move down
  let charAt = ((line - 1) / down) * right;
  const str = spec.ele;
  if (str.length <= charAt) charAt = charAt % str.length;
  return str.charAt(charAt);
}

function isTree(char) {
  return char == '#' ?  1 : 0;
}

function easyLoop(arr, right, down) {
  let charAt = count = 0;
  let line = 1 + down;
  while (line <= arr.length) {
   charAt += right;
   let str = arr[line - 1];
   if (str.length <= charAt) charAt = charAt % str.length;
   count += isTree(str.charAt(charAt));
   line += down;
  }
  return count;
}