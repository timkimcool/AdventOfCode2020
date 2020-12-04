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
  const hcl = (n) => regex(n, /#([0-9]|[a-f]){6}/);
  const ecl = (n) => {
    for (const color of eyeColor) {
      if (n === color) return true;
    }
    return false;
  };
  const pid = (n) => regex(n, /[0-9]{9}/);
  const numRange = (num, min, max) => !isNaN(num) && num >= min && num <= max;
  const eyeColor = ["amb", "blu", "brn", "gry", "grn", "hzl", "oth"];
  const regex = (n, r) => {
    let match = n.match(r);
    return match && n === match[0];
  }
  return { byr, iyr, eyr, hgt, hcl, ecl, pid };
})();

a = 2002;
b = 2003;
c = "60in";
d = "190cm";
e = "190in";
f = 190;
g = "#123abc";
h = "#123abz";
i = "123abc";
j = "brn";
k = "wat";
l = "000000001";
m = "0123456789";

byr1 = "byr";
hgt = "hgt";
hcl = "hcl";
ecl = "ecl";
pid = "pid";

console.log(formatChecker[pid](l));
console.log(formatChecker[pid](m));