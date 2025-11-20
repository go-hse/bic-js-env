// Deklaration einer Funktion a mit zwei Parametern
function a(p1 = "undefined", p2 = "undefined") {
    console.log(`p1: ${p1}, p2: ${p2} arg: [${Array.from(arguments).join(", ")}]`);
}

// Aufrufe der Funktion a
a();
a(1);
a(1, 2);
a(1, 2, 3, 4);

// Klassische Deklaration
function add(a, b) {
    return a + b;
}

// Aufruf
add(3, 4)


// Funktionsausdruck
const add = function (a, b) {
    return a + b;
};

// Arrow Function
const add = (a, b) => a + b;

const calcFunctions = {
    "SWB": () => { console.log("Softwaretechnik") },
    "TIB": () => { console.log("Technische Informatik") },
}

const keys = ["SWB", "TIB"];
for (const key of keys) {
    calcFunctions[key]();
}


function parseDate(str) {
    const m = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    return m ? new Date(m[3], m[2] - 1, m[1]) : null;
}

const validdates = ["24/12/2015", "7/8/1975"];
