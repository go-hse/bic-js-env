const modul = { titel: "Mathematik", note: 1.7 };

// Gib aus, ob die Prüfung bestanden ist (<= 4.0) und ob die Note sehr gut ist (<= 1.3).
// Verwende && und if, um zwei Bedingungen zu prüfen:
// 1. Bestanden (note <= 4.0)
// 2. Sehr gut (note <= 1.3)

// === Lösung ===
if (modul.note <= 4.0 && modul.note > 1.3) {
    console.log("Bestanden, aber nicht sehr gut");
}
if (modul.note <= 1.3) {
    console.log("Sehr gute Leistung!");
}
if (modul.note > 4.0) {
    console.log("Nicht bestanden");
}
