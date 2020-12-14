let reader = require('fs');
reader.readFile('13_in.txt', (err, data) => {
  if (err) throw err;
  let [ time, buses ] = data.toString().split('\r\n');
  busesNoX = buses.split(',').filter(bus => bus != 'x');
  buses = buses.split(',');
  

  // PART ONE
  console.log("Part One: ", solve(earliestBusID(time, busesNoX), time));
  // PART TWO
  console.log("Part Two: ", solve2(buses));
});

function earliestBusID(time, buses) {
  return buses.reduce((acc, cur) => (cur - time % cur < acc - time % acc) ? cur: acc, Number.MAX_VALUE);
}

function solve(busID, time) {
  return busID * (busID - (time % busID));
}

function solve2(buses) {
  let inc = BigInt(+buses[0]);
  let time = BigInt(inc);
  for (let i = 1n; i < buses.length; i+= 1n) {
    if (buses[i] == 'x') continue;
    let bus = BigInt(+buses[i]);
    while((time + i) % bus != 0) {
      time += inc;
    }
    inc *= bus;
  }
  return time;
}