
const { strict } = require('assert');
let reader = require('fs');
reader.readFile('test_in.txt', (err, data) => {
  if (err) throw err;

  const answers = data.toString().split('\n\n')
  .map(str => str.split('\n'))
  .map(arr => arr.map(str => str.split('')));
  
  // PART ONE
  console.log("Part One: ", answers);

});