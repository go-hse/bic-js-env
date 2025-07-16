export function keyboard() {
    const keys = {};

    // toggle wird bei keydown:active=true oder keyup:active=false aufgerufen
    function toggle(ev, active) {
        if (keys[ev.key] !== undefined) {
            ev.preventDefault();
            const KeyObject = keys[ev.key];
            if (KeyObject.active !== active) {
                KeyObject.active = active;
                KeyObject.callback(active);
            }

            if (!active && KeyObject.cbOnRelease !== undefined) {
                KeyObject.cbOnRelease();
            }
        } else {
            console.log(`unbekannt <${ev.key}>`);
        }
    }

    // Listener
    document.addEventListener("keydown", (ev) => toggle(ev, true));
    document.addEventListener("keyup", (ev) => toggle(ev, false));

    function add(key, callback, cbOnRelease) {
        keys[key] = { active: false, callback, cbOnRelease };  // KeyObject, oben
    }

    return add;
}

