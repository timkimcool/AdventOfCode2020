var vertices;
var bagSet = new Set();
const { strict } = require('assert');
let reader = require('fs');
reader.readFile('7_in.txt', (err, data) => {
  if (err) throw err;
  vertices = [];
  const bags = data.toString().split('\r\n')
    .map(bag => {
      bag = bag.split(" contain ");
      let sourceBag = bag[0].replace(" bags", "");
      console.log(bag[1]);
      let targetBags = bag[1].split(" bags, ").join(" bag, ").split(" bag, ").map(tBag => tBag.replace(" bags.", "").replace(" bag.", "").replace("no", "0"));
      let vertex = {
        name: sourceBag,
        explored: false,
        targets: {},
      }
      for (let tBag of targetBags) {
        let numBag = tBag[0];
        var bagType = tBag.substring(2);
        vertex["targets"][bagType] = +numBag ? +numBag : 0;
      }
      vertices[sourceBag] = vertex;
    });
  
  // PART ONE
  console.log("Part One: ", searchForBag("shiny gold"));

  // PART TWO
  console.log("Part Two: ", countTotalBags("shiny gold") - 1);
});

function searchForBag(targetBag) {
  for (const vertex in vertices) {
    if (!vertices[vertex].explored) {
      search(vertex, targetBag)
    }

  }
  bagSet.delete(targetBag);
  return bagSet.size;
}

// Part One
function search(vertexName, targetBag) {
  let vertex = vertices[vertexName];
  vertex.explored = true;
  if (vertexName == targetBag) { return addBag(vertexName); }  // 
  for (const bag in vertex.targets) {
    if (bag == "other") { continue; }
    if (!vertices[bag].explored && search(bag, targetBag)) { return addBag(vertexName); }
    if (vertices[bag].explored && bagSet.has(bag))  { return addBag(vertexName); }
    }
  return false;
}

function addBag(bag) {
  bagSet.add(bag);
  return true;
}

// Part Two
function countTotalBags(bag) {
  let count = 1;
  let vertex = vertices[bag];
  for (const target in vertex.targets) {
    if (target == "other") { return 1; }
    count = count + vertex.targets[target] * countTotalBags(target);
  }
  return count;
}