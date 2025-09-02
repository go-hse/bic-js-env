const zahlen = [3, 5, 7, 10];
const strings = ["Andreas", "Rößler", "Hochschule", "Esslingen"];
const gemischt = ["Anna", "Nym", 123456];
const dasObjekt = {
    zahlen: zahlen,
    strings: strings,
    alter: 25,
    vorname: "Anna",
    nachname: "Nym",
    adresse: {
        strasse: "Müllerstraße 15",
        ort: "Buxtehude",
    },
};
console.log(dasObjekt.alter);
console.log(dasObjekt.zahlen[1]);
// Zugriff auf Werte über den Schlüssel
dasObjekt.telefonNr = "0123-45678";
dasObjekt["telefonNr"] = "0123-45678";

const attribut = "telefonNr";
dasObjekt[attribut] = "0123-45678";
