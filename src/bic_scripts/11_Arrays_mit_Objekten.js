// Beispiel 1: Finde einen bestimmten Studierenden nach Matrikelnummer
const studenten = [
    { name: "Anna", matrikel: 101 },
    { name: "Ben", matrikel: 102 },
    { name: "Clara", matrikel: 103 }
];
console.log(studenten.find(s => s.matrikel === 102));

// Beispiel 2: Filtere alle Studierenden mit mehr als 30 ECTS-Punkten
const studenten2 = [
    { name: "Anna", ects: 28 },
    { name: "Ben", ects: 42 },
    { name: "Clara", ects: 36 }
];
console.log(studenten2.filter(s => s.ects > 30));

// Beispiel 3: Erzeuge ein Array mit nur den Namen der Dozierenden
const dozierende = [
    { name: "Dr. Meyer", fach: "Mathematik" },
    { name: "Prof. Schulz", fach: "Informatik" }
];
console.log(dozierende.map(d => d.name));

// Beispiel 4: Berechne die durchschnittliche Note aller Prüfungen
const pruef = [
    { fach: "Mathe", note: 2.0 },
    { fach: "Physik", note: 1.7 },
    { fach: "Informatik", note: 1.3 }
];
console.log(pruef.reduce((sum, p) => sum + p.note, 0) / pruef.length);

// Beispiel 5: Erstelle aus den Kursdaten eine Liste der Kursnamen mit ECTS-Werten
const kurse = [
    { name: "Programmieren", ects: 5 },
    { name: "Mathe 1", ects: 6 },
    { name: "Ethik", ects: 3 }
];
console.log(kurse.map(k => `${k.name} (${k.ects} ECTS)`));


