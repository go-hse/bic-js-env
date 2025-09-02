const d = new Date(); // das aktuelle Datum und Uhrzeit
console.log(new Date(0).toLocaleString()); // 1 Parameter: Zeit in ms
console.log(new Date(2025, 8, 30, 8, 15).toLocaleString()); // 2 oder mehr Parameter: Y/M-1/D/H/M/S/ms

const yyyy = d.getFullYear().toString();
const mm = (d.getMonth() + 1).toString().padStart(2, "0");
const dd = d.getDate().toString().padStart(2, "0");
const hh = d.getHours().toString().padStart(2, "0");
const mi = d.getMinutes().toString().padStart(2, "0");
const sc = d.getSeconds().toString().padStart(2, "0");
const wd = d.getDay();

const WD = ["So.", "Mo.", "Di.", "Mi.", "Do.", "Fr.", "Sa."];
console.log(`${WD[wd]}, ${dd}.${mm}.${yyyy} ${hh}:${mi}:${sc}`);

const nextWeek = new Date(d);
nextWeek.setDate(nextWeek.getDate() + 7); // rechnen mit Datum
console.log("Local", nextWeek.toLocaleString());
console.log("ISO", nextWeek.toISOString());

// Datum von Zeichenkette umwandeln
const stringDateLocal = "3.9.2025, 08:14:33";
// Date.parse liefert Zeitstempel (in ms)
const parsedLocal = new Date(Date.parse(stringDateLocal));
const stringDateISO = "2025-09-03T06:19:34.046Z";
const parsedISO = new Date(Date.parse(stringDateISO));

console.log(parsedLocal.toLocaleString(), "---", parsedISO.toString());
