// while
let i = 0; // Zählvariable
while (i < 10) {
    // Bedingung
    console.log(`wa: ${i}`);
    i = i + 2; // Veränderung der Zählvariable
}
while (i > 0) {
    console.log(`wb: ${i}`);
    i = i - 2;
}

// for
for (let i = 0; i < 10; i = i + 2) {
    console.log(`fa: ${i}`);
}
for (let i = 10; i > 3; i = i - 3) {
    console.log(`fb: ${i}`);
}
for (let i = 0; i < 10; ++i) {
    // ++i entspricht i = i + 1
    if (i % 2 == 0) continue; // geht zum nächsten Schritt
    console.log(`fc: ${i}`);
}
for (let i = 1; i < 10; ++i) {
    if (i % 4 == 0) break; // beende die Schleife
    console.log(`fd: ${i}`);
}
