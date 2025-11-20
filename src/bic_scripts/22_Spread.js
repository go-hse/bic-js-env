// Arrays zusammenfügen
const a = [1, 2];
const b = [3, 4];
const c = [...a, ...b];
// Ergebnis: [1, 2, 3, 4]

// Array clonen
const original = [1, 2, 3];
const kopieArr = [...original];


// Array für arguments ausbreiten
const werte = [4, 9, 2];
const max = Math.max(...werte);
// entspricht: Math.max(4, 9, 2)

// Objekte klonen
const person = { name: "Anna", alter: 30 };
const kopieObj = { ...person };

const basis = { name: "Anna" };
const details = { alter: 30, ort: "Stuttgart" };

// Objekte zusammenfügen
const kombiniert = { ...basis, ...details };
// Ergebnis: { name: "Anna", alter: 30, ort: "Stuttgart" }
