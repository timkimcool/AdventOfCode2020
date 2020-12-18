let reader = require('fs');
reader.readFile('18_in.txt', (err, data) => {
  if (err) throw err;
  let hw = data.toString().split('\r\n')
    .map(line => line.replace(/ /g, ''));

  // PART ONE
  console.log("Part One: ", sumHW(hw, ['+*']));

  // PART TWO
  console.log("Part Two: ", sumHW(hw, ['+', '*']));
});

function sumHW(hw, order) {
  return hw.reduce((acc, cur) => acc + doParenthesis(cur, order), 0);
}

let doMath = {
  '+': (x, y) => +x + +y,
  '*': (x, y) => +x * +y,
}

function doParenthesis(str, order) {
  let stack = [];
  let arr = str.split('');
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === '(') {
      stack.push(i);
    } else if (arr[i] === ')') {
      let pop = stack.pop() + 1;
      slice = arr.splice(pop, i - pop);
      i = pop - 1; 
      arr.splice(i, 2, solve(slice, order));
    }
  }
  return solve(arr, order);
}

function solve(arr, order) {
  for (let i = 0; i < order.length; i++) {
    for (let j = 0; j < arr.length; j++) {
      if (order[i].includes(arr[j])) {
        arr[j - 1] = doMath[arr[j]](arr[j - 1], arr[j + 1]);
        arr.splice(j, 2);
        j--;
      }
    }
  }
  return arr[0];
}