let reader = require('fs');
reader.readFile('15_in.txt', (err, data) => {
  if (err) throw err;
  let memStart = data.toString().split(',');

  // PART ONE
  console.log("Part One: ", recite(memStart, 2020));
  
  // PART TWO
  console.log("Part Two: ", recite(memStart, 30000000));
});

function recite(memStart, end) {
  end++;
  let mem = new Map();
  memStart.map((num, index) => mem.set(+num, [index + 1]));
  let count = mem.size + 1;
  let lastNum = +memStart[memStart.length - 1];
  let first = true;
  while (count < end) {
    lastNum = first ? 0 : mem.get(lastNum)[1] - mem.get(lastNum)[0];
    first = mem.has(lastNum) ? false : true;
    if (first) {
      mem.set(lastNum, [count]);
    } else {
      let lastEntry = mem.get(lastNum)[mem.get(lastNum).length - 1];
      mem.set(lastNum, [ lastEntry, count ]);
    }
    count++;
  }
  return lastNum;
}
