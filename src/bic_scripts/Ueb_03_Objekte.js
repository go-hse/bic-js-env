let dozenten = [
    { name: "Müller", fach: "Mathematik" },
    { name: "Schmidt", fach: "Informatik" },
    { name: "Meier", fach: "Physik" }
];

// Finde den Dozenten mit dem Namen "Müller" und gib sein Fach aus.


let i = 0;
let gefundenesFach = null;
while (i < dozenten.length) {
    if (dozenten[i].name === "Müller") {
        gefundenesFach = dozenten[i].fach;
        break;
    }
    i = i + 1;
}
console.log("Fach von Müller:", gefundenesFach);
