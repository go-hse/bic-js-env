
import { keyboard } from "./keyboard.mjs";
import { dateFormat, ymdhmsFileFormatter } from "./dateformat.mjs";

const default_script = `
// Globals: x, name
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
    "name": "Anna"
}
`;

export async function Main() {
    const addKey = keyboard();

    const codeEditor = CodeMirror(document.getElementById("editor"), {
        value: default_script,
        mode: "javascript",
        lineNumbers: true
    });

    const jsonEditor = CodeMirror(document.getElementById("json"), {
        value: default_json,
        mode: "application/json",
        lineNumbers: true,
        lineWrapping: true
    });

    const output = document.getElementById("output");

    const editInput = document.getElementById('editInput');
    document.addEventListener('click', function (e) {
        if (e.target !== editInput && e.target !== selectBox) {
            editInput.style.display = "none";
        }
    });


    const selectBox = document.getElementById('selectBox');
    let currentSelectedValue;
    selectBox.addEventListener('change', function () {
        const selected = selectBox.value;
        output.textContent += `Selected: ${selected} \n`;
        saveToLocalStorage();
        setCode(selected);
        currentSelectedValue = selected;
    });

    function startEditingOption(optionIndex) {
        const option = selectBox.options[optionIndex];
        if (!option) return;
        const oldValue = option.value;

        const rect = selectBox.getBoundingClientRect();
        const optionHeight = rect.height / selectBox.size;

        editInput.style.left = rect.left + "px";
        editInput.style.top = (rect.top + optionHeight * optionIndex) + "px";
        editInput.style.width = rect.width + "px";
        editInput.style.height = "14px";
        editInput.value = option.text;
        editInput.style.display = "block";
        editInput.focus();

        // Event-Handler für Eingabe
        editInput.onkeydown = function (e) {
            if (e.key === "Enter") {
                option.text = editInput.value;
                option.value = editInput.value;
                editInput.style.display = "none";
                codemap[option.value] = codemap[oldValue];
                delete codemap[oldValue];
                localStorage.setItem("codemap", JSON.stringify(codemap));
            } else if (e.key === "Escape") {
                editInput.style.display = "none";
            }
        };
    }

    function saveToLocalStorage() {
        if (currentSelectedValue) {
            const globals = jsonEditor.getValue();
            const code = codeEditor.getValue();
            codemap[currentSelectedValue] = { globals, code };
            localStorage.setItem("codemap", JSON.stringify(codemap));
            output.textContent += `Saved to ${currentSelectedValue} \n`;
        }
    }

    // Doppelklick auf Select → Bearbeiten starten
    selectBox.addEventListener('dblclick', function () {
        const index = selectBox.selectedIndex;
        if (index !== -1) {
            startEditingOption(index);
        }
    });

    function setCode(key) {
        if (codemap[key] !== undefined) {
            const { globals, code } = codemap[key];
            jsonEditor.setValue(globals);
            codeEditor.setValue(code);
        }
    }

    function addOption(key) {
        const option = document.createElement('option');
        option.text = key;
        option.value = key;
        selectBox.appendChild(option);
    }

    const codestring = localStorage.getItem("codemap") || "{}";
    const codemap = JSON.parse(codestring);
    const keys = Object.keys(codemap);
    for (const key of keys) {
        addOption(key);
    }

    document.getElementById("btnSave").addEventListener("click", saveToLocalStorage);
    document.getElementById("btnCopyNew").addEventListener("click", () => {
        const globals = jsonEditor.getValue();
        const code = codeEditor.getValue();

        const now = new Date();
        const formatted = now.toLocaleString(); // z. B. "16.7.2025, 14:23:45"
        const option = document.createElement('option');

        addOption(formatted);
        codemap[formatted] = { globals, code };
        localStorage.setItem("codemap", JSON.stringify(codemap));
        output.textContent += `Created: ${formatted} \n`;

    });

    document.getElementById("btnDel").addEventListener("click", () => {
        const selectedIndex = selectBox.selectedIndex;
        const key = selectBox.value;
        if (selectedIndex !== -1) {
            selectBox.remove(selectedIndex);
            output.textContent += `Deleted: ${key} \n`;
            if (codemap[key] !== undefined) {
                delete codemap[key];
                const codemapString = JSON.stringify(codemap);
                localStorage.setItem("codemap", codemapString);
            }
        }
    });

    addKey("F1", runCode);

    document.getElementById("btnRun").addEventListener("click", runCode);
    document.getElementById("btnDown").addEventListener("click", downloadJSON);

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
        output.textContent = "";
        const code = codeEditor.getValue();
        const iframe = document.getElementById("sandbox");
        iframe.contentWindow.postMessage({ code, globals }, "*");
    };

    const overlay = document.getElementById('overlay');
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


    function codesFromJSON(json) {
        const newkeys = Object.keys(json);
        for (const key of newkeys) {
            const newobj = json[key];
            if (typeof newobj.code === "string" && typeof newobj.globals === "string") {
                if (codemap[key] === undefined) {
                    addOption(key);
                }
                codemap[key] = newobj;
                console.log("added", key, newobj)
            }
        }
    }

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
            try {
                const json = JSON.parse(event.target.result);
                codesFromJSON(json);
            } catch (err) {
                output.textContent += 'Fehler beim Lesen der Datei:\n' + err.message;
            }
            localStorage.setItem("codemap", JSON.stringify(codemap));

        };
        reader.readAsText(file);
    });

    window.addEventListener("message", (event) => {
        if (event.data.type === "log") {
            output.textContent += "log:" + event.data.data + "\n";
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
        codesFromJSON(default_codes);
    } catch (ex) {
        console.log(ex);
    }

}

