const zahlen = [3, 5, 7, 10];
const strings = ["Andreas", "Rößler", "Hochschule", "Esslingen"];
const gemischt = ["Anna", "Nym", 123456];

console.log(zahlen[2]);
console.log(strings[2]);
console.log(gemischt[2]);
console.log(strings.length);

// Ersetzen; geht auch bei const-array
strings[3] = "Heilbronn";

// Array-Element zu String verknüfen
console.log(strings.join(", "));

// suchen; ohne Prüfung, ob Element vorhanden ist
const idx = zahlen.indexOf(10);
zahlen[idx] = 20;

console.log(zahlen.join(", "));

const joined = zahlen.concat(strings);
console.log(joined.join(", "));

const mehrZahlen = [3, 5, 7, 10, [1, 2, 3]];
console.log(mehrZahlen.join("; "));
console.log(mehrZahlen.flat().join(", "));

// siehe auch https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
