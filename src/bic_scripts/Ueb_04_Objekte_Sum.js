const module = [
    { titel: "Mathe 1", ects: 6 },
    { titel: "Programmieren", ects: 5 },
    { titel: "Datenbanken", ects: 4 }
];

// === Lösung ===
let summe = 0;
let j = 0;
while (j < module.length) {
    summe = summe + module[j].ects;
    j = j + 1;
}
console.log("Gesamt-ECTS:", summe);
