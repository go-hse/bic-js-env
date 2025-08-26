let vorname = "Andreas";
let nachname = "Rößler";

let adresse = `
Hochschule Esslingen,
Kanalstraße 33,
73728 Esslingen
`;

console.log("Namen", vorname, nachname);
console.log("Adresse", adresse);

let spezial = 'Das ist ein "Test".';
console.log(spezial);

spezial = "Das ist ein 'Test'.";
console.log(spezial);

let completeName = `${nachname}, ${vorname}`;
console.log(completeName);

completeName = nachname + ": " + vorname;
console.log(completeName, completeName.length);
console.log(completeName.toUpperCase());
console.log(completeName.toLowerCase());

let splitName = completeName.split(":"); // Ergebnis: Array
console.log("First Element:", splitName[0]);
