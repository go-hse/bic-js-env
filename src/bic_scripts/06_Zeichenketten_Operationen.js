const HSE = "Hochschule Esslingen";
console.log("Anzahl der Zeichen:", HSE.length);
console.log("Replace:", HSE.replace("Esslingen", "Heilbronn"));

console.log("Einzelne Zeichen:", HSE[0], HSE[11]);
console.log(HSE.slice(0, 10)); // 0 - 10
console.log(HSE.slice(11)); // ab 11
console.log(HSE.slice(-9)); // von hinten
