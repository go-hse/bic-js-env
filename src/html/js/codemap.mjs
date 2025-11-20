import { dateFormat, ymdhmsFileFormatter, parseDate } from "./dateformat.mjs";

export function CodeMap(boxAdd, boxClear, boxSelect) {

    const codemap = {};
    const codesFromStorageString = localStorage.getItem("codemap") || "{}";
    fromJSONstring(codesFromStorageString);
    refresh();

    function refresh() {
        boxClear();
        const ka = Object.keys(codemap).sort();
        for (const k of ka) {
            boxAdd(k);
        }
    }

    function set(k, v) {
        v.modified = dateFormat(new Date(), ymdhmsFileFormatter);
        console.log("set", k, v.modified);
        codemap[k] = v;
    }

    function get(k) {
        if (codemap[k]) return codemap[k];
        return {
            globals: "",
            code: ""
        }
    }

    function delItem(k) {
        if (codemap[k]) {
            delete codemap[k];
            console.log("delItem", k, keysAsString());
            save();
        }
    }

    function rename(oldId, newId) {
        set(newId, { globals: codemap[oldId].globals, code: codemap[oldId].code });
        delete codemap[oldId];
    }

    function save() {
        localStorage.setItem("codemap", JSON.stringify(codemap));
        refresh();
        return keysAsString();
    }

    function has(k) {
        return codemap[k] !== undefined;
    }

    function keysAsString() {
        const keys = Object.keys(codemap);
        const info = keys.map(k => `(${k}: ${codemap[k].modified})`);
        return info.join(" ");
    }


    function fromObject(json, forceOverwrite = false) {
        let resultString = "";
        try {
            const newkeys = Object.keys(json);
            for (const key of newkeys) {
                const newobj = json[key];
                const importDate = parseDate(newobj.modified);
                if (importDate && typeof newobj.code === "string" && typeof newobj.globals === "string") {
                    if (codemap[key]) {
                        const existingDate = parseDate(codemap[key].modified);
                        if (forceOverwrite || importDate > existingDate) {
                            codemap[key] = newobj;
                            resultString += `key <${key}> overwrite from ${codemap[key].modified} < ${newobj.modified}\n`;
                        }
                    } else {
                        codemap[key] = newobj; // 
                        // console.log("add", key, newobj.modified);
                    }
                }
            }
            refresh();
            return keysAsString();
        } catch (err) {
            console.log(err.message, "string", s);
        }
        return resultString;
    }

    function getJSON() {
        return JSON.stringify(codemap, null, 2);
    }

    function fromJSONstring(s, forceOverwrite = false) {
        try {
            const json = JSON.parse(s);
            return fromObject(json, forceOverwrite);
        } catch (err) {
            console.log(err.message, "string", s);
        }
    }

    return { set, get, save, rename, keysAsString, has, fromJSONstring, fromObject, delItem, getJSON };
}