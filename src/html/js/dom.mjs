export function dom(tag, attributes) {
    attributes = attributes || {};
    const namespace = attributes.namespace || "http://www.w3.org/1999/xhtml";
    let node = document.createElementNS(namespace, tag);
    for (let key in attributes) {
        if (key === "events") {
            for (let ev of attributes[key]) {
                for (const event in ev) {
                    node.addEventListener(event, ev[event]);
                }
            }
        } else if (key === "HTML") {
            node.innerHTML = attributes[key];
        } else {
            if (attributes[key])
                node.setAttribute(key, attributes[key]);
        }
    }
    for (let i = 2; i < arguments.length; ++i) {
        let child = arguments[i];
        if (typeof child === "string") {
            child = document.createTextNode(child);
            node.textnode = child;
        }
        node.appendChild(child);
    }
    return node;
}

export function Button(text, parent, callback) {
    const buttonElement = dom("button", { events: [{ click: callback }] }, text);
    parent.appendChild(buttonElement);
}


export function removeAllChildren(ele) {
    while (ele.firstChild) {
        ele.removeChild(ele.lastChild);
    }
}

export function checkBox(parent, id, label) {
    const checkBoxElement = dom("input", { type: "checkbox", id });
    const labelElement = dom("label", { class: "checkbox-label" }, label);
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


///////////////////////////////////////////////////////////////////////////
// WINDOW-Handling
///////////////////////////////////////////////////////////////////////////


export function Windows() {
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
                console.log("move", id, newX, newY);

            }
        });

        document.addEventListener('mouseup', function () {
            if (isDragging === id) {
                isDragging = undefined;
                document.body.style.userSelect = '';
                setPos(id, newX, newY);
                console.log("mouseup isDragging", id);
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
                console.log("resize", id, newWidth, newHeight);
            }
        });

        document.addEventListener('mouseup', function () {
            console.log("mouseup isResizing", id, isResizing);
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

    ///////////////////////////////////////////////////////////////////////////
    // INTERFACE
    ///////////////////////////////////////////////////////////////////////////

    function create(id, parent, options) {
        options.title ??= `Title: ${id}`;
        const titleElement = dom("div", { class: "title-bar", id: `title_${id}` }, options.title);
        const contentElement = dom("div", { id: `content_${id}` });
        const resizeElement = dom("div", { class: "resizer", id: `content_${id}` });

        const windowElement = dom("div", { class: "window", id }, titleElement, contentElement, resizeElement);
        parent.appendChild(windowElement);
        windowElement.style.zIndex = ++zIndex;


        currentWindowId = id;
        windows[id] = { windowElement, titleElement, contentElement, resizeElement, options };

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
            console.log("retrieve", id, windows[id].options);
            const windowElement = windows[id].windowElement;
            setPosSize(windowElement, options.x, options.y, options.w, options.h);
            windows[id].options = options;
        }
    }


    function get(id) {
        return windows[id];
    }

    return { create, get, setTitle };
}




