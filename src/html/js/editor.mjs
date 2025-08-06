import { javascript } from "@codemirror/lang-javascript"
import { EditorView, basicSetup } from "codemirror"

export function Editor(parent, doc, options = {}) {
    const view = new EditorView({
        doc: "console.log('Test', new Date()); \n",
        parent: parent,
        extensions: [
            basicSetup,
            javascript()
        ]
    });

    let fontSize = 14;
    view.dom.style.fontSize = `${fontSize}px`;

    function setValue(insert) {
        view.dispatch({
            changes: {
                from: 0,
                to: view.state.doc.length,
                insert
            }
        });
    }

    function fontUp() {
        fontSize = Math.min(fontSize + 1, 24);
        view.dom.style.fontSize = `${fontSize}px`;
    }

    function fontDown() {
        fontSize = Math.max(fontSize - 1, 8);
        view.dom.style.fontSize = `${fontSize}px`;
    }

    function getValue() {
        return view.state.doc.toString();
    }

    return { setValue, getValue, fontDown, fontUp };
}

export function MiniEditor(parent) {
    const view = new EditorView({
        extensions,
        parent
    });
    return view;
}

