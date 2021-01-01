let reader = require('fs');
reader.readFile('19_in.txt', (err, data) => {
  if (err) throw err;
  let [ rules, msgs ] = data.toString().split('\r\n\r\n')
    .map(line => line.split('\r\n'));

  // PART ONE
  console.log("Part One: ", testStrings(rules, [...msgs]));

  // PART TWO
  console.log("Part Two: ", solve2(rules, [...msgs]));
});

function solve2(rules, msgs) {
  let rulesObj = rulesToObj(rules);
  let rule42 = '(' + getRegExStr(rulesObj, 42) + ')';
  let rule31 = '(' + getRegExStr(rulesObj, 31) + ')';
  msgs = msgs.filter(msg => testStrings2(msg, [ rule42, rule31 ]));
  return msgs.length;
}

//test all combinations of valid rule42* + rule31*
function testStrings2(msg, rules) {
  let rule42g = new RegExp(rules[0], 'g');
  let count42 = (msg.match(rule42g) || []).length;
  let i42 = 1;
  let rule42 = rules[0]
  while(i42 < count42) {
    i42++;
    rule42 += rules[0];
    let rule31 = '';
    for(let i31 = 1; i31 < i42; i31++) {
      rule31 += rules[1];
      let regex = new RegExp('^' + rule42 + rule31 + '$');
      if (regex.test(msg)) return true;
    }
  }
  return false;
}

function getRegExStr(rulesObj, prop) {
  let str = rulesObj[prop];
  while (/\d/.test(str.toString())) {
    let number = ''
    let newStr = '';
    for(let i = 0; i < str.length; i++) {
      if (isNaN(str[i]) || str[i] === ' ') {
        if (number !== '') {
          newStr += rulesObj[number];
          number = '';
        }
        newStr += str[i];
      } else {
        number += str[i];
      }
    }
    str = newStr;
  }
  return str.slice(1, -1).replace(/\s/g, '');
}

function rulesToObj(rules) {
  rulesObj = {};
  rules.map(rule => {
    let [ prop, val ] = rule.split(': ');
    rulesObj[prop] = val.includes('\"') ?
      val.replace(/\"/g, '') : '(' + val.replace(/\"/g, '') + ')';
  })
  return rulesObj;
}

function testStrings(rules, msgs) {
  let rulesObj = rulesToObj(rules);
  let regex = RegExp('^' + getRegExStr(rulesObj, 0) + '$');
  msgs = msgs.filter(msg => regex.test(msg));
  return msgs.length;
}