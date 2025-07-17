
import { keyboard } from "./keyboard.mjs";

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

const addKey = keyboard();


window.onload = () => {
    const codeEditor = CodeMirror(document.getElementById("editor"), {
        value: default_script,
        mode: "javascript",
        lineNumbers: true
    });

    const jsonEditor = CodeMirror(document.getElementById("json"), {
        value: default_json,
        mode: "application/json",
        lineNumbers: true
    });

    const output = document.getElementById("output");
    const selectBox = document.getElementById('selectBox');
    selectBox.addEventListener('change', function () {
        const selected = selectBox.value;
        output.textContent += `Gewählte Option: ${selected}`;
        setCode(selected);
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

    document.getElementById("btnSave").addEventListener("click", () => {
        const globals = jsonEditor.getValue();
        const code = codeEditor.getValue();

        const now = new Date();
        const formatted = now.toLocaleString(); // z. B. "16.7.2025, 14:23:45"
        const option = document.createElement('option');

        addOption(formatted);
        codemap[formatted] = { globals, code };
        localStorage.setItem("codemap", JSON.stringify(codemap));
    });

    document.getElementById("btnDel").addEventListener("click", () => {
        const selectedIndex = selectBox.selectedIndex;
        const key = selectBox.value;
        if (selectedIndex !== -1) {
            selectBox.remove(selectedIndex);
            console.log("remove", selectedIndex, key);
            if (codemap[key] !== undefined) {
                delete codemap[key];
                localStorage.setItem("codemap", JSON.stringify(codemap));
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
        a.download = "daten.json";
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
                output.textContent = JSON.stringify(json, null, 2);
            } catch (err) {
                output.textContent += 'Fehler beim Lesen der Datei:\n' + err.message;
            }
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
}