const daten = ["Bachelor", true];  // [Studiengang, hatStipendium]

// Ein Array enthält zwei Einträge: Studiengang und ob der Student ein Stipendium hat.
// Berechne anhand von Bedingungen, ob Gebühren gezahlt werden müssen.
// Wenn Stipendium vorhanden (true), keine Gebühr.
// Wenn kein Stipendium und Studiengang "Bachelor" → 300 EUR
// Wenn kein Stipendium und Studiengang "Master" → 500 EUR

daten;

// === Lösung ===
let gebuehr = 0;

if (daten[1] === true) {
    gebuehr = 0;
} else if (daten[0] === "Bachelor" && daten[1] === false) {
    gebuehr = 300;
} else if (daten[0] === "Master" && daten[1] === false) {
    gebuehr = 500;
}

console.log("Studiengebühr:", gebuehr, "EUR");
