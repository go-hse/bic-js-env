const noten = [
    { modul: "Mathe 1", note: 3.3 },
    { modul: "Informatik", note: 1.7 },
    { modul: "Physik", note: 2.3 }
];

// Ein Student hat Noten für seine Module gespeichert.
// Ändere die Note des Moduls "Mathe 1" auf 2.0.

let k = 0;
while (k < noten.length) {
    if (noten[k].modul === "Mathe 1") {
        noten[k].note = 2.0;
        break;
    }
    k = k + 1;
}
console.log("Aktualisierte Noten:", noten);
