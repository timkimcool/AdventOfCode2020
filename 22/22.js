  let reader = require('fs');
const { createBrotliDecompress } = require('zlib');
reader.readFile('22_in.txt', (err, data) => {
  if (err) throw err;
  let [ p1, p2 ] = data.toString().split('\r\n\r\n');
  p1 = p1.split('\r\n').map(x => +x);
  p1.shift();
  p2 = p2.split('\r\n').map(x => +x);
  p2.shift();
  
  // PART ONE
  console.log("Part One: ", score(playCombat([...p1], [...p2])[1]));

  // PART TWO
  console.log("Part Two: ", score(playRecurCombat(p1, p2)[1]));

});
function playCombat(p1, p2) {
  while (p1.length !== 0 && p2.length !== 0) { 
    let p1Card = +p1.shift();
    let p2Card = +p2.shift();

    if (playNormal(p1Card, p2Card) === 1) {
      p1.push(p1Card);
      p1.push(p2Card);
    } else {
      p2.push(p2Card);
      p2.push(p1Card);
    }
  }

  return p1.length === 0 ? [ 2, p2 ] : [ 1, p1 ];
}

function playRecurCombat(p1, p2) {
  let prev1 = {};
  let prev2 = {};
  let winner;
  while (p1.length !== 0 && p2.length !== 0) { 
    if (checkPreviousGame(prev1, p1) || checkPreviousGame(prev2, p2)) {
      return [ 1, p1 ];
    }
    let p1Card = +p1.shift();
    let p2Card = +p2.shift();

    if (p1Card <= p1.length && p2Card <= p2.length) {
      winner = playRecurCombat(p1.slice(0, p1Card), p2.slice(0, p2Card))[0];
    } else {
      winner = playNormal(p1Card, p2Card);
    }
    
    if (winner === 1) {
      p1.push(p1Card);
      p1.push(p2Card);
    } else {
      p2.push(p2Card);
      p2.push(p1Card);
    }
  }
  return p1.length === 0 ? [ 2, p2 ] : [ 1, p1 ];
}

function score(cards) {
  return cards.reverse().reduce((acc, cur, i) => acc + cur * (i + 1), 0);
}

function playNormal(p1Card, p2Card) {
  return p1Card > p2Card ? 1 : 2;
}

function checkPreviousGame(obj, p) {
  p = p.toString();
  if (obj[p] !== undefined) return true;
  obj[p] = 1;
  return false;
}