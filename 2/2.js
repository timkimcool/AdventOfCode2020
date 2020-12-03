let start = +new Date();
const { strict } = require('assert');
let reader = require('fs');
reader.readFile('2_in.txt', (err, data) => {
    if (err) throw err;

    // PART ONE
    let arr = data.toString().split('\r\n');
    let count = 0;
    for (let i = 0; i < arr.length; i++) {
        let lineArr = arr[i].split(' ');
        let minMaxArr = lineArr[0].split('-');
        let min = parseInt(minMaxArr[0], 10);
        let max = parseInt(minMaxArr[1], 10);
        let char = lineArr[1].charAt(0);
        let charCount = lineArr[2].split(char).length - 1;
        if (charCount >= min && charCount <= max) {
            count++;
        }
    }
    console.log("Part One: ", count);
    console.log("Part One: " + (+new Date() - start) + " ms");

    // PART TWO
    arr = data.toString().split('\r\n');
    count = 0;
    for (let i = 0; i < arr.length; i++) {
        let lineArr = arr[i].split(' ');
        let minMaxArr = lineArr[0].split('-');
        let min = parseInt(minMaxArr[0], 10) - 1;
        let max = parseInt(minMaxArr[1], 10) - 1;
        let str = lineArr[2];
        let char = lineArr[1].charAt(0);
        if ((str.charAt(min) == char && str.charAt(max) != char) || (str.charAt(min) != char && str.charAt(max) == char)) {
            count++;
        }
    }
    console.log("Part Two: ", count);
    console.log("Part Two: " + (+new Date() - start) + " ms");
})

// Saerom's variable parsing + spacing + organization
const fs = require('fs');
try {
    const entries = fs.readFileSync('2_in.txt', 'utf8')
        .split('\r\n')
        .map(entry => entry.split(': '))
        .map(entry => {
            let [ policyInput, password ] = entry;
            let [ posInput, letter ] = policyInput.split(' ');
            let [ pos1, pos2 ] = posInput.split('-');
            return {
                policy: {letter, pos1, pos2 },
                password
            };
        });
    console.log(
        solve(entries)
    );
} catch (err) {
    console.error(err);
}

function solve(entries) {
    return entries.map(entry => isValidPassword(entry))
        .reduce((acc, curr) => curr ? acc + 1 : acc, 0);
}

function isValidPassword({ password, policy }) {
    const count = letterCount(password, policy.letter)
    return count >= policy.min && count <= policy.max;
}

function letterCount(text, letter) {
    let count = 0;
    for (let i = 0; i < text.length; i++) {
        if (text[i] == letter) count++;
    }
    return count;
}
