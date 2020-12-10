const { strict } = require('assert');
let reader = require('fs');
reader.readFile('9_in.txt', (err, data) => {
  if (err) throw err;
  vertices = [];
  const xmasData = data.toString().split('\r\n')
    .map(ele => +ele);
  
  // PART ONE
  console.log("Part One: ", findRuleBreaker(xmasData, 25));

  // PART TWO
  console.log("Part Two: ", findEncryptionWeakness(xmasData, 25));
});

// PART ONE
function findRuleBreaker(array, preambleLength) {
  for (let i = 0; i + preambleLength < array.length; i++) {
    let sum = array[i + preambleLength]
    if (!breakRule(array.slice(i, i + preambleLength), sum)) { return sum; }
  }
}

function breakRule(array, sum) {
  for (let i = 0; i < array.length; i++) {
    let value = sum - array[i];
    if (array.slice(i + 1).includes(value)) { return true; }
  }
  return false;
}

// PART TWO
function findEncryptionWeakness(array, preambleLength) {
  const value = findRuleBreaker(array, preambleLength);
  let setArray = findSet(array, value);
  return Math.min(...setArray) + Math.max(...setArray);
}

function findSet(array, value) {
  let setArray = [];
  let sum = 0;
  for (let i = 0; i < array.length; i++) {
    setArray.push(array[i])
    sum += array[i];
    while (sum > value) { sum -= setArray.shift(); }
    if (sum == value && setArray.length > 1) return setArray;
  }
}