let fs = require("fs");

/*
1. 동기
console.log("A");
let result = fs.readFileSync("syntax/sample.txt", "utf8");
console.log(result);
console.log("C");

결과
A
B
C
*/

/*
2. 비동기
console.log("A");
fs.readFile("syntax/sample.txt", "utf8", (err, result) => {
    console.log(result);
});
console.log("C");

결과
A
C
B
*/

let a = () => {
    console.log("a");
};

slowfunc = (callback) => {
    callback();
};

slowfunc(a);