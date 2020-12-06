
const { strict } = require('assert');
let reader = require('fs');
reader.readFile('6_in.txt', (err, data) => {
  if (err) throw err;

  const answers = data.toString().split('\r\n\r\n');
  
  // PART ONE
  console.log("Part One: ", getUniqueAnsCount(answers));

  // PART TWO
  console.log("Part Two: ", getCommonAnsCount(answers));
});

function getUniqueAnsCount(answers) {
  return answers.map(ans => ans.replace(/[\n\r]+/g,""))
    .map(ans => getUniqueLetterCount(ans))
    .reduce((acc, cur) => acc + cur, 0);
}

function getCommonAnsCount(answers) {
  return answers.map(ans => ans.split('\r\n')
    .sort((a, b) => a.length - b.length))   // only compare shortest entry
    .map(ans => getCommonLetterCount(ans))
    .reduce ((acc, cur) => acc + cur, 0);
}

function getUniqueLetterCount(str) {
  let ansSet = new Set();
  for (let char of str) {
    ansSet.add(char);
  }
  return ansSet.size;
}

function getCommonLetterCount(answers) {
  if (answers.length == 1) { return getUniqueLetterCount(answers[0]); }
  let count = 0;
  for (let char of answers[0]) {
    let countChar = true;
    for (let i = 1; i < answers.length; i++) {
      if (!answers[i].includes(char)) {
        countChar = false;
        break;
      }
    }
    if (countChar) { count++; }
  }
  return count;
}