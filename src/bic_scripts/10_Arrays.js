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

// Arrays in String
const mehrZahlen = [3, 5, 7, 10, [1, 2, 3]];
console.log(mehrZahlen.join("; "));
console.log(mehrZahlen.flat().join(", "));

// siehe auch https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array


// Multipliziere alle Zahlen im Array mit 2
const zahlen = [1, 2, 3, 4];
const verdoppelt = zahlen.map(x => x * 2);
console.log(verdoppelt); // [2, 4, 6, 8]

// Summiere alle Zahlen eines Arrays
const werte = [10, 20, 30];
const summe = werte.reduce((acc, val) => acc + val, 0);
console.log(summe); // 60

// Filtere alle geraden Zahlen heraus
const zahlen2 = [1, 2, 3, 4, 5, 6];
const gerade = zahlen2.filter(x => x % 2 === 0);
console.log(gerade); // [2, 4, 6]

// Finde den ersten Namen, der länger als 4 Buchstaben ist
const namen = ["Tom", "Lisa", "Alexander", "Mia"];
const langerName = namen.find(n => n.length > 4);
console.log(langerName); // "Alexander"

// Prüfe, ob alle Werte größer als 0 sind
const zahlen3 = [3, 5, 8, 1];
const allePositiv = zahlen3.every(x => x > 0);
console.log(allePositiv); // true



