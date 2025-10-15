import { compiled_date } from "./compiled.mjs"

export function dom(tag, attributes = {}, ...children) {
    const namespace = attributes.namespace || "http://www.w3.org/1999/xhtml";
    const node = document.createElementNS(namespace, tag);

    for (const [key, value] of Object.entries(attributes)) {
        if (key === "namespace" || key === "events" || key === "text") continue;
        if (value !== false && value != null) {
            node.setAttribute(key, String(value));
        }
    }

    if (attributes.events && typeof attributes.events === "object") {
        for (const [event, handler] of Object.entries(attributes.events)) {
            if (typeof handler === "function") {
                node.addEventListener(event, handler);
            }
        }
    }

    if (typeof attributes.text === "string") {
        node.appendChild(document.createTextNode(attributes.text));
    }

    for (const child of children) {
        if (typeof child === "string") {
            node.appendChild(document.createTextNode(child));
        } else if (child instanceof Node) {
            node.appendChild(child);
        }
    }

    return node;
}

export function Button(text, parent, callback, explanation = "") {
    const span = dom("span", { text: explanation });
    const btn = dom("button", { events: { click: callback } }, text);
    const buttonElement = dom("div", {}, btn, span);
    parent.appendChild(buttonElement);
}

export function Info(parent) {
    const infoObj = compiled_date();
    const InfoElement = dom("div", { class: "info" }, `F7/F8 toggles layout; compiled ${infoObj.COMPILED}`);
    parent.appendChild(InfoElement);
}

export function removeAllChildren(ele) {
    while (ele.firstChild) {
        ele.removeChild(ele.lastChild);
    }
}

export function checkBox(parent, id, label) {
    const checkBoxElement = dom("input", { type: "checkbox", id });
    const labelElement = dom("label", { class: "checkbox-label", text: label });
    labelElement.appendChild(checkBoxElement);
    parent.appendChild(labelElement);

    const item = localStorage.getItem(id);
    checkBoxElement.checked = item !== null && item === "true";
    console.log(id, checkBoxElement.checked);

    checkBoxElement.addEventListener("change", () => {
        localStorage.setItem(id, checkBoxElement.checked);
        console.log("checkBox", id, checkBoxElement.checked);
    });
}

export function removeOptions(selectElement) {
    let i, L = selectElement.options.length - 1;
    for (i = L; i >= 0; i--) {
        selectElement.remove(i);
    }
}


///////////////////////////////////////////////////////////////////////////
// WINDOW-Handling
///////////////////////////////////////////////////////////////////////////


export function Windows(onDragCallback) {
    const windows = {};
    let currentWindowId, zIndex = 0;

    function bringToFront(el) {
        el.style.zIndex = ++zIndex;
        currentWindowId = el.id;
    }

    function setPos(id, x, y) {
        if (windows[id]) {
            windows[id].options.x = x;
            windows[id].options.y = y;
            saveToLocalStorage(id);
        }
    }

    function setSize(id, w, h) {
        if (windows[id]) {
            windows[id].options.w = w;
            windows[id].options.h = h;
            saveToLocalStorage(id);
        }
    }

    function makeDraggable(windowElement) {
        const id = windowElement.id;
        const windowObj = windows[id];
        let isDragging, newX, newY;

        let offsetX = 0, offsetY = 0;
        windowObj.titleElement.addEventListener('mousedown', function (e) {
            isDragging = id;
            offsetX = e.clientX - windowElement.offsetLeft;
            offsetY = e.clientY - windowElement.offsetTop;
            document.body.style.userSelect = 'none';
            bringToFront(windowElement);
        });

        document.addEventListener('mousemove', function (e) {
            if (isDragging === id) {
                newX = e.clientX - offsetX;
                newY = e.clientY - offsetY;

                const maxX = window.innerWidth - windowElement.offsetWidth;
                const maxY = window.innerHeight - windowElement.offsetHeight;

                newX = Math.max(0, Math.min(newX, maxX));
                newY = Math.max(0, Math.min(newY, maxY));

                windowElement.style.left = newX + 'px';
                windowElement.style.top = newY + 'px';

                onDragCallback();
                // console.log("move", id, newX, newY);
            }
        });

        document.addEventListener('mouseup', function () {
            if (isDragging === id) {
                isDragging = undefined;
                document.body.style.userSelect = '';
                setPos(id, newX, newY);
                // console.log("mouseup isDragging", id);
            }
        });

    }

    function makeResizable(windowElement) {
        const id = windowElement.id;
        const resizer = windowElement.querySelector('.resizer');
        let minWidth = 200;
        let minHeight = 100;
        let isResizing, newWidth, newHeight;


        resizer.addEventListener('mousedown', function (e) {
            isResizing = id;
            bringToFront(windowElement);
            document.body.style.userSelect = 'none';
            e.preventDefault();
        });

        document.addEventListener('mousemove', function (e) {
            if (isResizing === id) {
                newWidth = e.clientX - windowElement.offsetLeft;
                newHeight = e.clientY - windowElement.offsetTop;

                newWidth = Math.max(minWidth, Math.min(newWidth, window.innerWidth - windowElement.offsetLeft));
                newHeight = Math.max(minHeight, Math.min(newHeight, window.innerHeight - windowElement.offsetTop));

                windowElement.style.width = newWidth + 'px';
                windowElement.style.height = newHeight + 'px';
                // console.log("resize", id, newWidth, newHeight);
            }
        });

        document.addEventListener('mouseup', function () {
            // console.log("mouseup isResizing", id, isResizing);
            if (isResizing === id) {
                isResizing = undefined;
                document.body.style.userSelect = '';
                setSize(id, newWidth, newHeight);
                console.log("finished isResizing", id);
            }
        });
    }

    function setPosSize(windowElement, x, y, newWidth, newHeight) {
        windowElement.style.left = x + 'px';
        windowElement.style.top = y + 'px';
        windowElement.style.width = newWidth + 'px';
        windowElement.style.height = newHeight + 'px';
    }

    function set(id, x, y, newWidth, newHeight) {
        const windowElement = windows[id].windowElement;
        windowElement.style.left = x + 'px';
        windowElement.style.top = y + 'px';
        windowElement.style.width = newWidth + 'px';
        windowElement.style.height = newHeight + 'px';
        windows[id].onResize(windows[id].contentElement);
    }

    function setResizeCB(id, cb) {
        windows[id].onResize = cb;
    }

    function hide(id) {
        const windowElement = windows[id].windowElement;
        windowElement.style.display = "none";
    }

    function show(id) {
        const windowElement = windows[id].windowElement;
        windowElement.style.display = "flex";
    }


    ///////////////////////////////////////////////////////////////////////////
    // INTERFACE
    ///////////////////////////////////////////////////////////////////////////

    function create(id, parent, options) {
        options.title ??= `Title: ${id}`;
        const titleElement = dom("div", { class: "title-bar", id: `title_${id}`, text: options.title });
        const contentElement = dom("div", { id: `content_${id}`, class: "item" });
        const resizeElement = dom("div", { class: "resizer", id: `resize_${id}` });

        const windowElement = dom("div", { class: "window", id }, titleElement, contentElement, resizeElement);
        parent.appendChild(windowElement);
        windowElement.style.zIndex = ++zIndex;


        currentWindowId = id;
        windows[id] = { windowElement, titleElement, contentElement, resizeElement, options, onResize: () => { } };

        makeDraggable(windowElement);
        makeResizable(windowElement);

        if (options && typeof options.x === "number" && typeof options.y === "number" && typeof options.w === "number" && typeof options.h === "number") {
            setPosSize(windowElement, options.x, options.y, options.w, options.h);
        }

        retrieveFromLocalStorage(id);
        return windows[id];
    }

    function setTitle(id, title) {
        if (windows[id]) {
            windows[id].titleElement.textContent = title;
            windows[id].options.title = title;
        }
    }

    function saveToLocalStorage(id) {
        if (windows[id]) {
            console.log("saving", id, windows[id].options);
            localStorage.setItem(`window.${id}`, JSON.stringify(windows[id].options));
        }
    }

    function retrieveFromLocalStorage(id) {
        const item = localStorage.getItem(`window.${id}`);
        if (item && windows[id]) {
            const options = JSON.parse(item);
            // console.log("retrieve", id, windows[id].options);
            const windowElement = windows[id].windowElement;
            setPosSize(windowElement, options.x, options.y, options.w, options.h);
            windows[id].options = options;
        }
    }

    function toFront(id) {
        if (windows[id]) {
            bringToFront(windows[id].windowElement);
        }
    }


    function get(id) {
        return windows[id];
    }

    return { create, get, setTitle, toFront, set, hide, show, setResizeCB };
}




