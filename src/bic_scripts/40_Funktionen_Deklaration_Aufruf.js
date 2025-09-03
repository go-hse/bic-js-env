// Deklaration einer Funktion a mit zwei Parametern
function a(p1 = "undefined", p2 = "undefined") {
    console.log(`p1: ${p1}, p2: ${p2} arg: [${Array.from(arguments).join(", ")}]`);
}

// Aufrufe der Funktion a
a();
a(1);
a(1, 2);
a(1, 2, 3, 4);
