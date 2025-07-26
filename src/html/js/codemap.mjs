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

        if (ka.length > 0) {
            const first = ka[0];
            const { globals, code } = get(first);
            boxSelect(0, code, globals);
        }
    }

    function set(k, v) {
        codemap[k] = v;
    }

    function get(k) {
        if (codemap[k]) return codemap[k];
        return {
            globals: "",
            code: ""
        }
    }

    function rename(oldId, newId) {
        codemap[newId] = { globals: codemap[oldId].globals, code: codemap[oldId].code };
        delete codemap[oldId];
    }

    function save() {
        localStorage.setItem("codemap", JSON.stringify(codemap));
        return keysAsString();
    }

    function has(k) {
        return codemap[k] !== undefined;
    }

    function keysAsString() {
        return Object.keys(codemap).join(" ");
    }


    function fromObject(json) {
        try {
            const newkeys = Object.keys(json);
            for (const key of newkeys) {
                const newobj = json[key];
                if (typeof newobj.code === "string" && typeof newobj.globals === "string") {
                    codemap[key] = newobj;
                    console.log("added", key, newobj)
                }
            }
            return keysAsString();
        } catch (err) {
            console.log(err.message, "string", s);
        }
    }


    function fromJSONstring(s) {
        try {
            const json = JSON.parse(s);
            return fromObject(json);
        } catch (err) {
            console.log(err.message, "string", s);
        }
    }

    return { set, get, save, rename, keysAsString, has, fromJSONstring, fromObject };
}