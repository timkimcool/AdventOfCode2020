  let reader = require('fs');
reader.readFile('25_in.txt', (err, data) => {
  if (err) throw err;
  let [ cardKey, doorKey ] = data.toString().split('\r\n')
    .map(x => +x);
  console.log(cardKey, doorKey)
  // PART ONE
  // console.log('Part One: ', doMovesLL([...arr], 9, 2))
  console.log(doTransforms(doorKey, findLoopSize(cardKey)));
  console.log(doTransforms(cardKey, findLoopSize(doorKey)));
  // PART TWO
  // console.log("Part Two: ", doMoves(popMillionArr([...arr]), 60));

});

function findLoopSize (pubKey, subNum = 7, val = 1, loopSize = 0) {
  while (val !== pubKey) {
    val = transform(val, subNum);
    loopSize++;
  }
  return loopSize;
}

function transform (val, subNum) {
  val *= subNum;
  return val % 20201227;
}

function doTransforms (subNum, loopSize, val = 1) {
  for (let i = 0; i < loopSize; i++) {
    val = transform(val, subNum);
  }
  return val;
}