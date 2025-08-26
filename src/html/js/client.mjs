
import { keyboard } from "./keyboard.mjs";
import { dateFormat, hmsFormatter, ymdhmsFileFormatter } from "./dateformat.mjs";
import { Windows, dom, Button, removeOptions, Info } from "./dom.mjs";
import { CodeMap } from "./codemap.mjs";
import { formatJavascript, formatJSON } from "./format.mjs";
import { Editor } from "./editor.mjs";

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

const editor6ID = "editor6";
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

    const codeEditor = Editor(editorWindow.contentElement, default_script);
    const jsonEditor = Editor(jsonWindow.contentElement, default_json);

    const output = outputWindow.contentElement;


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

    function startEditingCurrentOption() {
        const index = selectBox.selectedIndex;
        if (index !== -1) {
            startEditingOption(index);
        }
    }


    // Doppelklick auf Select → Bearbeiten starten
    selectBox.addEventListener('dblclick', startEditingCurrentOption);

    function addOption(key) {
        const option = document.createElement('option');
        option.text = key;
        option.value = key;
        selectBox.appendChild(option);
    }

    function saveToCodemap() {
        if (currentSelectedValue) {
            const globals = jsonEditor.getValue();
            const code = codeEditor.getValue();
            codeMapMgr.set(currentSelectedValue, { globals, code });
        }
        codeMapMgr.save();
        if (currentSelectedValue) {
            selectItem(currentSelectedValue);
        }
    }

    // function saveToLocalStorage() {
    //     codeMapMgr.save();
    // }


    async function formatCurrentJavascript() {
        const JS = codeEditor.getValue();
        const formattedJS = await formatJavascript(JS);
        codeEditor.setValue(formattedJS);
        return formattedJS;
    }

    function formatCurrentJSON() {
        const JS = jsonEditor.getValue();
        const formattedJS = formatJSON(JS);
        jsonEditor.setValue(formattedJS);
        return formattedJS;
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

    Button("Save", interfaceWindow.contentElement, saveToCodemap, "Saves all entries (code+json) to local storage in your browser");
    Button("New", interfaceWindow.contentElement, newItem, "Creates a new entry (name: current date) with the actual code+json.");


    Button("Delete", interfaceWindow.contentElement, () => {
        const selectedIndex = selectBox.selectedIndex;
        const key = selectBox.value;
        if (selectedIndex !== -1) {
            selectBox.remove(selectedIndex);
            codeMapMgr.delItem(key);
        }
    }, "Deletes current item (code+json)");

    addKey("F1", runCode);
    addKey("F2", startEditingCurrentOption);
    addKey("F5", runCode);

    for (let i = 0; i < 9; ++i) {
        addKey(`${i + 1}`, () => { selectItemByIndex(i) }, undefined, { ctrlKey: true, altKey: false, shiftKey: false, metaKey: false });
    }
    addKey(`s`, saveToCodemap, undefined, { ctrlKey: false, altKey: true, shiftKey: false, metaKey: false });
    addKey(`n`, newItem, undefined, { ctrlKey: false, altKey: true, shiftKey: false, metaKey: false });

    addKey(`+`, increaseFont, undefined, { ctrlKey: true, altKey: false, shiftKey: false, metaKey: false });
    addKey(`-`, decreaseFont, undefined, { ctrlKey: true, altKey: false, shiftKey: false, metaKey: false });

    function increaseFont() {
        codeEditor.fontUp();
        jsonEditor.fontUp();
    }
    function decreaseFont() {
        codeEditor.fontDown();
        jsonEditor.fontDown();
    }


    Button("Run (F1)", interfaceWindow.contentElement, runCode, "Runs the code with json-data");
    Button("Download", interfaceWindow.contentElement, downloadJSON, "Downloads all items (code+json) together in a single json-file. You can upload that file by dragging it in here.");

    Info(interfaceWindow.contentElement);

    function downloadJSON() {
        const jsonString = codeMapMgr.getJSON();
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

    async function runCode() {
        saveToCodemap();

        let globals = {};
        try {
            const globalsRaw = formatCurrentJSON();
            globals = globalsRaw ? JSON.parse(globalsRaw) : {};
        } catch (e) {
            output.textContent = "Global variable parsing error: " + e.message;
            return;
        }
        const time = dateFormat(new Date(), hmsFormatter);
        output.textContent = `Starting ${currentSelectedValue} at ${time}\n`;
        const code = await formatCurrentJavascript();
        const iframe = document.getElementById("sandbox");
        iframe.contentWindow.postMessage({ code, globals }, "*");
    };

    const overlay = dom("div", { id: "overlay" });
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
        const response = await fetch('default_codes.json');
        const default_codes = await response.text();
        codeMapMgr.fromJSONstring(default_codes);
    } catch (ex) {
        console.log(ex, default_codes);
    }

}

