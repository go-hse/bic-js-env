
let die_antwort_auf_alles = 42;  // Deklaration mit Schlüsselwort let und Initialisierung mit Wert 42
console.log("Die Antwort", die_antwort_auf_alles); // Ausgabe - Funktioniert nicht in BIC PE

let leere_variable; // Deklaration mit let OHNE Initialisierung
die_antwort_auf_alles = 43; // neue Zuweisung, Veränderung der Variable

// Konstante Variablen; keine weitere Zuweisung
const MwstSatzProzent = 0.19;
const NettoPreisEuro = 10;

let BruttoPreisEuro = NettoPreisEuro * MwstSatzProzent;
const BruttoPreisEuro = NettoPreisEuro * MwstSatzProzent;
BruttoPreisEuro = NettoPreisEuro * MwstSatzProzent;


console.log("BruttoPreisEuro", BruttoPreisEuro);

// alt:
var name = "Max";

