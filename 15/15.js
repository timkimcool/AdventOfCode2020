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
  let mem = new Map();
  memStart.map((num, index) => mem.set(+num, index + 1));
  let count = mem.size + 1;
  let lastNum = +memStart[mem.size];
  end++;
  while (count < end) {
    curNum = mem.has(lastNum) ? count - 1 - mem.get(lastNum) : 0;
    mem.set(lastNum, count - 1);
    lastNum = curNum;
    count++;
  }
  return lastNum;
}