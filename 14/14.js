let reader = require('fs');
reader.readFile('14_in.txt', (err, data) => {
  if (err) throw err;
  let prog = data.toString().split('\r\n')
    .map(map => map.split(' = '))
    .map(([ ins, value]) => {
      if (ins != 'mask') { 
        value = +value;
        ins = +ins.substring(4, ins.length - 1);
      }
      return [ ins, value ];
    });
  

  // PART ONE
  console.log("Part One: ", solve(runProg(prog)));
  
  // PART TWO
  console.log("Part Two: ", solve(runProgV2(prog)));
});

function solve(obj) {
  return Object.values(obj)
    .reduce((acc, cur) => cur === undefined ? acc : acc + cur, 0);
}

// PART ONE
function runProg(prog) {
  let obj = {};
  let mask;
  prog.map(([ins, val]) => {
    if (ins === 'mask') {
      mask = val;
    } else {
      val = val.toString(2).padStart(36, '0');
      obj[ins] = parseInt(maskValue(mask, val, 'X'), 2);
    }
  })
  return obj;
}

function maskValue(mask, val, unChange) {
  return mask.split('')
    .reduce((acc, cur, i) => cur === unChange ? acc + val[i] : acc + cur, '');
}

// PART TWO
function runProgV2(prog) {
  let obj = {};
  let mask;
  prog.map(([ins, val]) => {
    if (ins === 'mask') {
      mask = val;
    } else {
      let memSlotInBits = ins.toString(2).padStart(36, '0');
      let addr = maskValue(mask, memSlotInBits, '0');
      populateObj(obj, addr, val);
    }
  })
  return obj;
}

function populateObj(obj, str, val) {
  for (let i = 0; i < str.length; i++) {
    if (str[i] === 'X') {
      populateObj(obj, replaceCharAt(str, i, '1'), val);
      populateObj(obj, replaceCharAt(str, i, '0'), val);
      return;
    }
  }
  obj[parseInt(str,2)] = val;
}

function replaceCharAt(str, index, char) {
  return str.substring(0, index) + char + str.substring(index + 1);
}