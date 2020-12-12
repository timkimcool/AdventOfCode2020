const { strict, fail } = require('assert');
let reader = require('fs');
reader.readFile('12_in.txt', (err, data) => {
  if (err) throw err;
  let navIns = data.toString().split('\r\n')
    .map(dir => [ dir.substring(0, 1), +dir.substring(1) ]);
  // SeatLayout[row][column]
  let nav = {
    curDir: 1,
    N: 0,
    S: 0,
    E: 0,
    W: 0,
    turn: [ "N", "E", "S", "W" ],
  }

  // PART ONE
  console.log("Part One: ", runIns(navIns, nav));

  // PART TWO
  let nav2 = {
    wayPoint: {
      N: 1,
      S: 0,
      E: 10,
      W: 0,
    },
    N: 0,
    S: 0,
    E: 0,
    W: 0,
    turn: [ "N", "E", "S", "W" ],
  }
  console.log("Part Two: ", runIns2(navIns, nav2));
});

// PART ONE
function runIns(navIns, nav) {
  navIns.map(ins => move(ins[0], ins[1], nav));
  return manhattanDis(nav);
}

function move(dir, dis, nav) {
  if (dir === "F") {
    nav[nav.turn[nav.curDir]] += dis;
  } else if (dir === "R" || dir === "L") {
    nav.curDir = (nav.curDir + turn(dir, dis)) % 4;
  } else {
    nav[dir] += dis;
  }
}

// PART TWO
function runIns2(navIns, nav) {
  navIns.map(ins => move2(ins[0], ins[1], nav));
  return manhattanDis(nav);
}

function move2(dir, dis, nav) {
  if (dir === "F") {
    for (const direction in nav.wayPoint) {
      nav[direction] += dis * nav.wayPoint[direction];
    }
  } else if (dir === "R" || dir === "L") {
    let numTurns = turn(dir, dis);
    let tempWayPoint = Object.assign({}, nav.wayPoint);
    for (let i = 0; i < 4; i++) {
      nav.wayPoint[nav.turn[(i + numTurns) % 4]] = tempWayPoint[nav.turn[i]];
    }
  } else { nav.wayPoint[dir] += dis; }
} 

// SHARED
function turn(dir, deg) {
  if (dir === "R") { 
    return deg/90; 
  } else { return 4 - deg/90; }
}

function manhattanDis(nav) {
  return Math.abs(nav.N - nav.S) + Math.abs(nav.E - nav.W);
}