export function keyboard() {
    const keys = {};
    const defaultMeta = { ctrlKey: false, altKey: false, shiftKey: false, metaKey: false };
    const metaKeys = Object.keys(defaultMeta);

    function compare(m, e) {
        for (const k of metaKeys) {
            if (m[k] !== e[k]) return false;
        }
        return true;
    }


    // toggle wird bei keydown:active=true oder keyup:active=false aufgerufen
    function toggle(ev, active) {
        if (keys[ev.key] !== undefined) {
            const KeyObject = keys[ev.key];
            if (compare(KeyObject.meta, ev)) {
                ev.preventDefault();
                if (active) {
                    KeyObject.callback();
                }

                if (!active && KeyObject.cbOnRelease !== undefined) {
                    KeyObject.cbOnRelease();
                }
            }
        } else {
            console.log(`unbekannt <${ev.key}>`);
        }
    }

    // Listener
    document.addEventListener("keydown", (ev) => toggle(ev, true));
    document.addEventListener("keyup", (ev) => toggle(ev, false));

    function add(key, callback, cbOnRelease, meta = defaultMeta) {
        keys[key] = { callback, cbOnRelease, meta };  // KeyObject, oben
    }

    return add;
}

