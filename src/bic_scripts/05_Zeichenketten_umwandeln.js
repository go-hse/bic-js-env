const piString = "3.1415";
const pi = parseFloat(piString);
const radius = 10;
const umfang = 2 * pi * radius;
const umfangS1 = piString * 2 * radius;
const umfangS2 = piString + 2 + radius;
console.log("Pi", piString, typeof piString, pi, typeof pi);
console.log("Umfang", umfang);
console.log("Umfang", umfangS1);
console.log("Umfang", umfangS2);

console.log("i", parseInt("101", 2));
console.log("i", parseInt("101", 4));
console.log("i", parseInt("101", 10));
