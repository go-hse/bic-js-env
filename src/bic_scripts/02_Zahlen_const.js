const x = 2; // Zuweisungen
const y = 1.1;

// Ausgabe mit console.log
console.log("Typen", typeof x, typeof y);

console.log("Addition", x + y);
console.log("Subtraktion", (x - y).toFixed(2));
console.log("Multiplikation", x * y);
console.log("Division", (x / y).toFixed(3));

const x2 = 14; // Neue Zuweisung
const m = x % 5; // Modulo-Operator: ganzzahliger Rest

console.log("Modulo", m);
