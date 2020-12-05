
const { strict } = require('assert');
let reader = require('fs');
reader.readFile('5_in.txt', (err, data) => {
  if (err) throw err;

  const bPasses = data.toString().split('\r\n')
    .map(bPass => {
      let row = bPass.substring(0, 7);
      let col = bPass.substring(7);
      let seatID = strToSeatID({ row, col });
      return { row, col, seatID };
    });
  
  // PART ONE
  console.log("Part One: ", bigBPass(bPasses));

  // Part TWO
  console.log("Part Two: ", myBPass(bPasses));
});

function bigBPass(bPasses) {
  return bPasses.reduce((big, bPass) => bPass.seatID > big ? bPass.seatID : big, 0);
}
function strToSeatID(bPass) {
  return parseInt(strToBit(bPass.row, "B"), 2) * 8 + parseInt(strToBit(bPass.col, "R"), 2);
}

function strToBit(str, front) {
  let bit = "";
  for (let char of str) { bit = bit.concat(char == front ? 1 : 0); }
  return bit;
}

function myBPass(bPasses) {
  let seatIDs = Array.from(bPasses, bPass => bPass.seatID);
  seatIDs.sort();
  for (let i = 0; i < seatIDs.length; i++) {
    if (seatIDs[i] + 1 != seatIDs[i + 1]) { return seatIDs[i] + 1; }
  }
}