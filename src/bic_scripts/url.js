function getURL_Parameters(url) {
    let para = "", split = [], kv = {};
    if (url.includes("?")) {
        para = _case.url.split("?")[1];
        split = para.split("&");

        for (const part of split) {
            const [key, value] = part.split("=");
            kv[key] = value;
        }
    }
    return kv;
}



const output = {
    d: new Date().toString(),
    kv: getURL_Parameters(_case.url)
}
output;
