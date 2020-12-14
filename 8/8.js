let reader = require('fs');
reader.readFile('8_in.txt', (err, data) => {
  if (err) throw err;
  vertices = [];
  const code = data.toString().split('\r\n')
    .map(line => {
      let [ act, value ] = line.split(" ");
      let done = false;
      return { act, value, done };
    });
  
  // PART ONE
  let copyCode = JSON.parse(JSON.stringify(code));
  console.log("Part One: ", exeCode(copyCode, 0, 0, false));

  // PART TWO
  copyCode = JSON.parse(JSON.stringify(code));
  console.log("Part Two: ", fixCode(copyCode));
});

function exeCode(code, acc, line, fix) {
  if (line == code.length - 1) {
    return (code[line].act == "acc") ? acc + +code[line].value : acc;
  }
  if (code[line].done) return fix ? false : acc;
  code[line].done = true;
  switch(code[line].act) {
    case "nop":
      return exeCode(code, acc, line + 1, fix);
    case "jmp":
      return exeCode(code, acc, line + +code[line].value, fix);
    case "acc":
      return exeCode(code, acc + +code[line].value, line + 1, fix);
  }
}

function fixCode(code) {
  for (let i = 0; i < code.length; i ++) {
    if (code[i].act == "acc") continue;
    let value = runCopyCode(code, i);
    if (value) return value;
  }
}

function runCopyCode(code, line) {
  copyCode = JSON.parse(JSON.stringify(code));
  copyCode[line].act = (code[line].act == "nop") ? "jmp" : "nop";
  return exeCode(copyCode, 0, 0, true);
}