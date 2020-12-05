
const { strict } = require('assert');
let reader = require('fs');
const { parse } = require('path');
reader.readFile('test_in.txt', (err, data) => {
  if (err) throw err;

  const bPasses = data.toString().split('\r\n')
    .map(bPass => {
      let row = bPass.substring(0, 7);
      let col = bPass.substring(7);
      return { row, col };
    });
  
  console.log(bPasses);
  // PART ONE
  console.log("Part One: ", bigBPass(bPasses));
});




function bigBPass(bPasses) {
  return bPasses.map(bPass => bitToSeatID(bPass));
}
function bitToSeatID(bPass) {
  console.log(parseInt(strToBit(bPass.row, "B"), 2), parseInt(strToBit(bPass.col, "R"), 2));
  return parseInt(strToBit(bPass.row, "B"), 2) * 8 + parseInt(strToBit(bPass.col, "R"), 2);
}

function strToBit(str, front) {
  let bit = "";
  for (let char of str) { bit = bit.concat(char == front ? 1 : 0); } // char == "B" || char == "R"
  return bit;
}
