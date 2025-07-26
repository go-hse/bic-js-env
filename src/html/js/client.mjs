
import { keyboard } from "./keyboard.mjs";
import { dateFormat, hmsFormatter, ymdhmsFileFormatter } from "./dateformat.mjs";
import { Windows, dom, Button, removeOptions } from "./dom.mjs";
import { CodeMap } from "./codemap.mjs";

const default_script = `
// Default
for (let i = 0; i < 5; i++) {
    x += i;
    console.log('x is', x);
}

let test_name = "test";
try {
    test_name = name;
} catch (ex) {
    console.log(ex.message);
}

const output = {
    x,
    d: new Date().toString(),
    test_name
}
output;
`;

const default_json = `
{
    "x": 5, 
    "name": "Anna",
    "info": "hard coded default, not in local storage"
}
`;

const editorID = "editor";
const inputID = "json";
const outputID = "output";
const uiID = "ui";

export async function Main() {

    const addKey = keyboard();

    const windowManager = Windows();
    const editorWindow = windowManager.create(editorID, document.body, { x: 0, y: 0, w: 400, h: 600 });
    const jsonWindow = windowManager.create(inputID, document.body, { x: 401, y: 0, w: 400, h: 600 });
    const outputWindow = windowManager.create(outputID, document.body, { x: 802, y: 100, w: 200, h: 600 });
    const interfaceWindow = windowManager.create(uiID, document.body, { x: 802, y: 0, w: 200, h: 600 });


    const codeEditor = CodeMirror(editorWindow.contentElement, {
        value: default_script,
        mode: "javascript",
        lineNumbers: true
    });

    const jsonEditor = CodeMirror(jsonWindow.contentElement, {
        value: default_json,
        mode: "application/json",
        lineNumbers: true,
        lineWrapping: true
    });

    const output = outputWindow.contentElement;


    // SELECTBOX


    const editInput = dom("input", { type: "text", class: "select-input" });
    const selectBox = dom("select", { size: "5" });

    interfaceWindow.contentElement.appendChild(selectBox);
    interfaceWindow.contentElement.appendChild(editInput);

    document.addEventListener('click', function (e) {
        if (e.target !== editInput && e.target !== selectBox) {
            editInput.style.display = "none";
        }
    });

    selectBox.addEventListener('change', function () {
        selectItem(selectBox.value);
    });


    let currentSelectedValue;
    function selectItem(selected, code, globals) {
        output.textContent += `Selected: ${selected} \n`;
        saveToLocalStorage();
        setCodeToWindows(selected, code, globals);
        currentSelectedValue = selected;
        setTitles(currentSelectedValue);

        if (selectBox.value !== currentSelectedValue) selectBox.value = currentSelectedValue;
    }

    function selectItemByIndex(idx, code, globals) {
        const keys = selectBox.options;
        if (idx < keys.length) {
            selectItem(keys[idx].value, code, globals);
        }
    }

    const codeMapMgr = CodeMap((k) => addOption(k), () => removeOptions(selectBox), selectItemByIndex);


    const titleRectHeight = interfaceWindow.titleElement.getBoundingClientRect().height;

    function setTitles(title) {
        windowManager.setTitle(editorID, `JS ${title}`);
        windowManager.setTitle(outputID, `Output from ${title}`);
        windowManager.setTitle(inputID, `Input for ${title}`);
        windowManager.setTitle(uiID, `Selected ${title}`);
    }

    function startEditingOption(optionIndex) {
        const option = selectBox.options[optionIndex];
        const optRect = option.getBoundingClientRect();

        if (!option) return;
        const rect = selectBox.getBoundingClientRect();
        const top = titleRectHeight + 5 + optRect.height * optionIndex; // rect.top + 

        console.log(`i ${optionIndex} rh ${rect.height} oh ${optRect.height}`);

        editInput.style.left = "0px";
        editInput.style.top = top + "px";
        editInput.style.width = (rect.width - 20) + "px";
        editInput.style.height = "14px";
        editInput.value = option.text;
        editInput.style.display = "block";
        editInput.focus();

        // Event-Handler für Eingabe
        editInput.onkeydown = function (e) {
            if (e.key === "Enter") {
                const renamedSelectedValue = editInput.value
                option.text = renamedSelectedValue;
                option.value = renamedSelectedValue;
                editInput.style.display = "none";
                codeMapMgr.rename(currentSelectedValue, renamedSelectedValue);
                currentSelectedValue = renamedSelectedValue;
                output.textContent += `Saved to ${currentSelectedValue} \n`;
                setTitles(currentSelectedValue);
            } else if (e.key === "Escape") {
                editInput.style.display = "none";
            }
        };
    }
    // Doppelklick auf Select → Bearbeiten starten
    selectBox.addEventListener('dblclick', function () {
        const index = selectBox.selectedIndex;
        if (index !== -1) {
            startEditingOption(index);
        }
    });

    function addOption(key) {
        const option = document.createElement('option');
        option.text = key;
        option.value = key;
        selectBox.appendChild(option);
    }

    function saveToLocalStorage() {
        if (currentSelectedValue) {
            const globals = jsonEditor.getValue();
            const code = codeEditor.getValue();
            codeMapMgr.set(currentSelectedValue, { globals, code });
            const keys = codeMapMgr.save();
            output.textContent += `Saving: ${keys}\n`;
        }
    }


    function setCodeToWindows(key, code, globals) {
        if (code != undefined && globals !== undefined) {
            jsonEditor.setValue(globals);
            codeEditor.setValue(code);
        } else if (codeMapMgr.has(key)) {
            const { globals, code } = codeMapMgr.get(key);
            jsonEditor.setValue(globals);
            codeEditor.setValue(code);
        }
    }

    function newItem() {
        const globals = jsonEditor.getValue();
        const code = codeEditor.getValue();

        const now = new Date();
        const formatted = now.toLocaleString(); // z. B. "16.7.2025, 14:23:45"
        const option = document.createElement('option');

        addOption(formatted);
        codeMapMgr.set(formatted, { globals, code })
        output.textContent += `Created: ${formatted} \n`;
    }

    Button("Save", interfaceWindow.contentElement, saveToLocalStorage, "Saves all entries (code+json) to local storage in your browser");
    Button("New", interfaceWindow.contentElement, newItem, "Creates a new entry (name: current date) with the actual code+json.");


    Button("Delete", interfaceWindow.contentElement, () => {
        const selectedIndex = selectBox.selectedIndex;
        const key = selectBox.value;
        if (selectedIndex !== -1) {
            selectBox.remove(selectedIndex);
            if (codemap[key] !== undefined) {
                delete codemap[key];
                const keys = Object.keys(codemap).join(", ");
                output.textContent += `Deleted: ${key} remaining [${keys}]\n`;
            }
        }
    }, "Deletes current item (code+json)");

    addKey("F1", runCode);
    for (let i = 0; i < 9; ++i) {
        addKey(`${i + 1}`, () => { selectItemByIndex(i) }, undefined, { ctrlKey: true, altKey: false, shiftKey: false, metaKey: false });
    }
    addKey(`s`, saveToLocalStorage, undefined, { ctrlKey: false, altKey: true, shiftKey: false, metaKey: false });
    addKey(`n`, newItem, undefined, { ctrlKey: false, altKey: true, shiftKey: false, metaKey: false });

    Button("Run (F1)", interfaceWindow.contentElement, runCode, "Runs the code with json-data");
    Button("Download", interfaceWindow.contentElement, downloadJSON, "Downloads all items (code+json) together in a single json-file. You can upload that file by dragging it in here.");

    function downloadJSON() {
        const jsonString = JSON.stringify(codemap, null, 2);
        const blob = new Blob([jsonString], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        const datestring = dateFormat(new Date(), ymdhmsFileFormatter);
        a.download = `bic-code-data.${datestring}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function runCode() {
        let globals = {};
        try {
            const globalsRaw = jsonEditor.getValue();
            globals = globalsRaw ? JSON.parse(globalsRaw) : {};
        } catch (e) {
            output.textContent = "Global variable parsing error: " + e.message;
            return;
        }
        const time = dateFormat(new Date(), hmsFormatter);
        output.textContent = `Starting ${currentSelectedValue} at ${time}\n`;
        const code = codeEditor.getValue();
        const iframe = document.getElementById("sandbox");
        iframe.contentWindow.postMessage({ code, globals }, "*");
    };

    const overlay = dom("div");
    document.body.appendChild(overlay);

    ['dragenter', 'dragover'].forEach(eventName => {
        document.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
            overlay.style.display = 'flex';
        }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        document.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
            overlay.style.display = 'none';
        }, false);
    });


    // Datei verarbeiten beim Drop
    document.addEventListener('drop', (e) => {
        const files = e.dataTransfer.files;
        if (files.length === 0) return;

        const file = files[0];
        if (!file.name.endsWith('.json')) {
            output.textContent += 'Bitte eine JSON-Datei verwenden.';
            return;
        }

        const reader = new FileReader();
        reader.onload = function (event) {
            codeMapMgr.fromJSONstring(event.target.result);
        };
        reader.readAsText(file);
    });

    window.addEventListener("message", (event) => {
        if (event.data.type === "log") {
            output.textContent += event.data.data + "\n";
        }
        if (event.data.type === "error") {
            output.textContent += "Error: " + event.data.data + "\n";
        }
        if (event.data.type === "result") {
            output.textContent += "output: " + event.data.data + "\n";
        }
    });


    const observer = new MutationObserver(() => {
        output.scrollTop = output.scrollHeight;
    });

    observer.observe(output, {
        characterData: true,
        childList: true,
        subtree: true
    });

    try {
        const response = await fetch('/dist/default_codes.json');
        const default_codes = await response.json();
        codeMapMgr.fromObject(default_codes);
    } catch (ex) {
        console.log(ex);
    }

}

