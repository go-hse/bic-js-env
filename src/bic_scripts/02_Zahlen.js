let x = 2; // Zuweisungen
let y = 1.1;

// Ausgabe mit console.log
console.log("Typen", typeof x, typeof y);

console.log("Addition", x + y);
console.log("Subtraktion", (x - y).toFixed(2));
console.log("Multiplikation", x * y);
console.log("Division", (x / y).toFixed(3));

x = 14; // Neue Zuweisung
y = x % 5; // Modulo-Operator: ganzzahliger Rest

console.log("Modulo", y);
