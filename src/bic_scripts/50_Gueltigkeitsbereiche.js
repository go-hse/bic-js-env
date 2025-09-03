let x = 17;
console.log("globales x", x);

function GFUnktion() {
    console.log("globales x in GFunktion", x);
}

function Funktion(p) {
    // eigener Gültigkeitsbereich
    let x = p * 2; // lokale Variable
    console.log("lokales x", x);
    if (p > 10) {
        // innerer Gültigkeitsbereich
        let x = 100;
        console.log("sehr lokales x", x);
    }
    return x;
}
GFUnktion();
console.log("Ergebnis", Funktion(15));
