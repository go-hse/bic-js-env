import { EditorView, basicSetup } from "codemirror"
import { javascript, esLint } from "@codemirror/lang-javascript";
import { linter, lintGutter } from "@codemirror/lint";
import { globals } from "globals";

import * as browserESlint from "eslint-linter-browserify";

const linterConfig = {
    // eslint configuration
    languageOptions: {
        globals: {
            ...globals.browser,
        },
        parserOptions: {
            ecmaVersion: 6,
            sourceType: "module",
        },
    },
    rules: {
        "semi-style": ["error", "last"],
        "no-unused-vars": "warn"
    }
};

const cmLinterConfig = {
    autoPanel: true
}


export function Editor(parent, doc, options = {}) {
    const view = new EditorView({
        doc: "console.log('Test', new Date()); \n",
        parent: parent,
        extensions: [
            basicSetup,
            javascript(),
            lintGutter(),
            linter(esLint(new browserESlint.Linter(), linterConfig), cmLinterConfig),
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

