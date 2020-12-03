let str = "..............##..#...#....#...";
let right = 100;
if (str.length < right) {
  right = right%str.length;
  console.log(right);
}