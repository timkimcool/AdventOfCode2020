
const { strict } = require('assert');
let reader = require('fs');
reader.readFile('4_in.txt', (err, data) => {
  if (err) throw err;

  const arr = data.toString()
    .split('\r\n\r\n')
    .map(ele => ele.replace(/(\r?\n|\r)/g, " "))
    .map(ele => ele.split(" "))
    .map(ele => {
      const passport = {};
      ele.forEach(line => {
        let [ varName, value ] = line.split(':');
        passport[varName] = value;
      });
      return passport;
    });
  const reqFields = [ "byr", "iyr", "eyr", "hgt", "hcl", "ecl", "pid" ];
  
  // PART ONE
  console.log("Part One: ", validate(arr, reqFields));

  // PART TWO
  let complex = true;
  console.log("Part Two: ", validate(arr, reqFields, complex));
});

function validate(arr, reqFields, complex) {
  return arr.map(passport => checkFields(passport, reqFields, complex))
  .reduce((acc, curr) => curr ? acc + 1 : acc, 0);
}

function checkFields(passport, reqFields, complex) {
  for (const field of reqFields) {
    if (passport[field] === undefined) return 0;
    if (complex && !formatChecker[field](passport[field])) return 0;
  }
  return 1;
}

const formatChecker = (() => {
  const byr = (n) => numRange(n, 1920, 2002);
  const iyr = (n) => numRange(n, 2010, 2020);
  const eyr = (n) => numRange(n, 2020, 2030);
  const hgt = (n) => {
    if (typeof n) n = String(n);
    let unit = n.charAt(n.length-2) + n.charAt(n.length-1);
    if (unit === "cm") return numRange(n.substring(0, n.length-2), 150, 193);
    if (unit === "in") return numRange(n.substring(0, n.length-2), 59, 76);
    return false;
  }
  const numRange = (num, min, max) => !isNaN(num) && num >= min && num <= max;

  const hcl = (n) => regex(n, /#([0-9]|[a-f]){6}/);
  const pid = (n) => regex(n, /[0-9]{9}/);
  const regex = (n, r) => {
    let match = n.match(r);
    return match && n === match[0];
  }

  const ecl = (n) => {
    for (const color of eyeColor) {
      if (n === color) return true;
    }
    return false;
  };
  const eyeColor = ["amb", "blu", "brn", "gry", "grn", "hzl", "oth"];

  return { byr, iyr, eyr, hgt, hcl, ecl, pid };
})();
