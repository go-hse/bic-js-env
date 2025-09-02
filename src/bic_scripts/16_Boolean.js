// Wahrheitswerte
const d = new Date(),
    sc = d.getSeconds(),
    mi = d.getMinutes();

const isEven = sc % 2 == 0;

console.log(`Sekunde ${sc} gerade? ${isEven}`);
console.log(`${sc} UND ${mi} gerade? ${sc % 2 == 0 && mi % 2 == 0}`);
console.log(`${sc} ODER ${mi} gerade? ${sc % 2 == 0 || mi % 2 == 0}`);
