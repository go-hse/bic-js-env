const dasObjekt = {
    alter: 25,
    vorname: "Anna",
    nachname: "Nym",
    adresse: {
        strasse: "Müllerstraße 15",
        ort: "Buxtehude",
    },
};

for (const k in dasObjekt) {
    console.log(`(in) dasObjekt[${k}] ist ${dasObjekt[k]}`);
}

// Objekt.keys liefert Array mit allen Schlüsseln
const keys = Object.keys(dasObjekt).sort();
for (const k of keys) {
    console.log(`(of) dasObjekt[${k}] ist ${dasObjekt[k]}`);
}

const WD = ["So.", "Mo.", "Di.", "Mi.", "Do.", "Fr.", "Sa."];
for (const k of WD) {
    console.log(`Wochentag ${k}`);
}

for (let i = 0; i < WD.length; ++i) {
    console.log(`Wochentag ${i}: ${WD[i]}`);
}
