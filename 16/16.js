let reader = require('fs');
reader.readFile('16_in.txt', (err, data) => {
  if (err) throw err;
  let [ numRange, yourTic, tickets ] = data.toString().split('\r\n\r\n');

  // add all possible range values to array for faster access
  let numHeap = numRange.split('\r\n')
    .map(ele => ele.substring(ele.indexOf(': ') + 2)
    .split(' or '))
    .reduce((acc, cur) => acc.concat(cur), [])
    .map(ran => ran.split('-'));
  numHeap = heap(numHeap);

  tickets = tickets.split('\r\n').slice(1);
  
  // PART ONE
  console.log("Part One: ", errorRate(tickets, numHeap));
  
  // PART TWO
  console.log("Part Two: ", solve2(numRange, numHeap, yourTic, tickets))
});

function heap(numRange) {
  let arr = [];
  let count = 0;
  numRange.map(([ min, max ]) => {
    arr[min] = 1;
    arr[max] = -1;
  });
  for(let i = 0; i < arr.length; i++) {
    if (arr[i] != undefined) {
      count += arr[i];
      arr[i] = 1;
    } else if (count > 0) arr[i] = 1;
  }
  return arr;
}

//  PART ONE
function errorRate(nearTic, numHeap) {
  return nearTic.reduce((acc, cur) => {
    cur.split(",").map(val => {
      acc = numHeap[val] === 1 ? acc : acc + +val });
    return acc;
  },
  0);
}

//  PART TWO
function solve2(numRange, numHeap, yourTic, tickets) {
  // String => Object { "name": fieldName, "range": arrayOfPossibleValues }
  let fields = createFieldHeapsObj(numRange);

  tickets = filterTickets(tickets.map(tic => tic.split(',')), numHeap);
  let fieldMap = findFieldPosition(fields, tickets) // Object {field: index}
  yourTic = yourTic.split('\r\n')[1].split(',');
  return multiplyDeptFields(fieldMap, yourTic);
}

function createFieldHeapsObj(numRange) {
  return numRange.split('\r\n')
  .map(field => {
    let fieldObj = {};
    fieldObj["name"] = field.substring(0, field.indexOf(': '));
    fieldRange = field.substring(field.indexOf(': ') + 2)
      .split(' or ')
      .reduce((acc, cur) => acc.concat(cur), [])
      .map(ran => ran.split('-'));
    fieldObj["range"] = heap(fieldRange);
    return fieldObj;
  });
}

function filterTickets(tickets, numHeap) {
  return tickets.filter(ticket => {
    for (const val of ticket) {
      if (numHeap[+val] !== 1) return false;
    }
    return true;
  })
}

function findFieldPosition(fields, tickets) {
  let positionMap = {};
  for (const field of fields) {
    positionMap[field["name"]] = possibleFields(field["range"], tickets);
  }
  return filterPossibleFields(positionMap);
}

function possibleFields(fieldRange, tickets) {
  let arr = [];
  for (let j = 0; j < tickets[0].length; j++) {
    for (let i = 0; i < tickets.length; i++) {
      if (fieldRange[tickets[i][j]] !== 1) break;
      if (i === tickets.length - 1) {
        arr.push(j);
      }
    }
  }
  return arr;
}

function filterPossibleFields(fieldMap) {
  let retObj = {};
  let done = false;
  while (!done) {
    done = true;
    for (const field in fieldMap) {
      if (fieldMap[field].length === 1) {
        let val = fieldMap[field][0];
        retObj[field] = val;
        for (const field2 in fieldMap) {
          if (field !== field2 && fieldMap[field2].length !== 1) {
            let index = fieldMap[field2].indexOf(val);
            fieldMap[field2].splice(index, 1);
            done = false;
          }
        }
        delete fieldMap[field];
      }
    }
  }
  return retObj;
}

function multiplyDeptFields(fieldMap, ticket) {
  let retVal = 1;
  for (const field in fieldMap) {
    if (field.includes("departure")) {
      retVal *= +ticket[fieldMap[field]];
    }
  }
  return retVal;
}