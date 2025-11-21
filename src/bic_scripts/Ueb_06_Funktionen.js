// 1.
// Schreibe eine Funktion attendance(teilnehmer, gesamt),
// die die Teilnahmequote in Prozent berechnet.
// Falls gesamt nicht angegeben ist, soll der Defaultwert 30 gelten (z. B. eine Seminargröße).

function attendance(teilnehmer, gesamt = 30) {
    return `Quote ${(100 * (teilnehmer / gesamt)).toFixed(1)}%`;
}

console.log(attendance(10));
console.log(attendance(10, 100));

// 2.
// Erstelle eine Arrow Function roomLabel(building, room), die z. B. aus
// "Gebäude F" und "103" → "<F-103>" erzeugt.
// Nutze die kompakte Schreibweise ohne geschweifte Klammern.

function roomLabel(building, room) {
    return `<${building}-${room}>`;
}

const roomLbl = (building, room) => `<${building}-${room}>`;
console.log(roomLabel("F", 114), roomLbl("F", 114));

/* 3.
Schreibe eine Funktion gradeSum(), die beliebig viele Noten addiert.
Nutze dafür arguments Berechne außerdem den Durchschnitt und gib beides zurück.
 */

function gradeSum() {
    let sum = 0;
    const args = [...arguments];
    for (const a of args) {
        sum += a;
    }
    return { sum, avg: sum / arguments.length };
}

const graded = gradeSum(1.3, 3.0, 2.7);
graded;
