let start = +new Date();
let reader = require('fs');
reader.readFile('1_in.txt', (err, data) => {
    if (err) throw err;

    // PART ONE
    let array = data.toString().split('\r\n').map(x => parseInt(x, 10));
    
    for (let i = 0; i < array.length; i++) {
        for (let j = i + 1; j < array.length - 1; j++) {
            if (array[i] + array[j] == 2020) {
                console.log("Part One: " + array[i] * array[j]);
                break;
            }
        }
    }
    console.log("Part One: " + (+new Date() - start) + " ms");

    // PART TWO
    for (let i = 0; i < array.length; i++) {
        for (let j = i + 1; j < array.length - 1; j++) {
            for (let k = j + 1; k < array.length - 2; k++) {
                if (array[i] + array[j] + array [k] == 2020) {
                    console.log("Part Two: " + array[i] * array[j] * array[k]);
                    break;
                }
            }
        }
    }
    console.log("Part Two: " + (+new Date() - start) + " ms");
})