// Deklaration einer Funktion a mit zwei Parametern
function createObject(name, alter) {
    if (typeof alter === "string") {
        alter = parseInt(alter, 10);
    }
    return { name, alter };
}

// Umwandlung Objekt in String
function o2s(o) {
    let s = "";
    for (const k in o) {
        s += `${k}: ${o[k]}; `;
    }
    return s;
}

// Aufrufe der Funktion a und o2s
console.log(o2s(createObject("Ida", 7)));
console.log(o2s(createObject("Hans", "73")));

console.log(JSON.stringify(createObject("Hans", "73"), null, 2));

