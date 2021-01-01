  let reader = require('fs');
reader.readFile('21_in.txt', (err, data) => {
  if (err) throw err;
  let foods = data.toString().split('\r\n')
    .map(line => line.slice(0, -1).split(' (contains '));
  
  let [ IngArr, algArr, algObj ] = findAllergen(foods);

  // PART ONE
  console.log("Part One: ", nonAllergenCount(IngArr, algArr));

  // PART TWO
  console.log("Part Two: ", allergenList(algObj));
});

function nonAllergenCount(IngArr, algArr) {
  return [...IngArr].filter(ing => !algArr.includes(ing)).length;
}

function allergenList(algObj) {
  str = Object.keys(algObj).sort()
    .reduce((acc, cur) => acc += algObj[cur] + ',', '');
  return str.slice(0, -1);
}

function findAllergen(foods) {
  let IngArr = [];
  let algArr = [];
  let allObj = {};
  let algObj = {};
  addAllIng(foods, IngArr);
  foodsToObject(foods, allObj);
  filterAllergens(allObj, algArr, algObj);
  return [ IngArr, algArr, algObj ];
}

function addAllIng(foods, IngArr) {
  foods.map(food => food[0].split(' ')
    .map(ing => IngArr.push(ing)));
}

function foodsToObject(foods, allObj) {
  [...foods].map(([ ings, algs ]) => {
    ingsArr = ings.split(' ');
    algs.split(', ').forEach(alg => {
      if (allObj[alg] === undefined) {
        allObj[alg] = ingsArr;
      } else {
        allObj[alg] = allObj[alg].filter(alg => ingsArr.includes(alg));
      }
    });
  });
}

function filterAllergens(allObj, algArr, algObj) {
  while (Object.keys(allObj).length > 0) {
    loop:
    for (const alg1 of Object.keys(allObj)) {
      if (allObj[alg1].length === 1) {
        let ing = allObj[alg1][0];
        algArr.push(ing);
        algObj[alg1] = ing;
        Object.keys(allObj).forEach(alg2 => {
          allObj[alg2] = allObj[alg2].filter(ele => ele !== ing); 
          if (allObj[alg2].length === 0) delete allObj[alg2];
        });
        break loop;
      }
    }
  }
}