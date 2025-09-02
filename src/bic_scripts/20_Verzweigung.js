const sc = new Date().getSeconds();
if (sc % 2 == 0) {
    console.log(`${sc} ist gerade`);
} else {
    console.log(`${sc} ist ungerade`);
}

if (sc < 15) {
    console.log(`${sc} - eine viertel Minute`);
} else if (sc < 30) {
    console.log(`${sc} - eine halbe Minute`);
} else if (sc < 45) {
    console.log(`${sc} - eine dreiviertel Minute`);
} else {
    console.log(`${sc} - eine Minute`);
}
