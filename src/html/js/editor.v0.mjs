import { EditorView, basicSetup } from "codemirror";
import { EditorState } from '@codemirror/state';
import { openSearchPanel, highlightSelectionMatches } from '@codemirror/search';
import { indentWithTab, history, defaultKeymap, historyKeymap } from '@codemirror/commands';
import { foldGutter, indentOnInput, indentUnit, bracketMatching, foldKeymap, syntaxHighlighting, defaultHighlightStyle } from '@codemirror/language';
import { closeBrackets, autocompletion, closeBracketsKeymap, completionKeymap } from '@codemirror/autocomplete';
import { lineNumbers, highlightActiveLineGutter, highlightSpecialChars, drawSelection, rectangularSelection, crosshairCursor, highlightActiveLine, keymap } from '@codemirror/view';

// Language
import { javascript } from "@codemirror/lang-javascript";

const extensions = [
    basicSetup,
    lineNumbers(),
    highlightActiveLineGutter(),
    highlightSpecialChars(),
    history(),
    foldGutter(),
    drawSelection(),
    indentUnit.of("    "),
    EditorState.allowMultipleSelections.of(true),
    indentOnInput(),
    bracketMatching(),
    closeBrackets(),
    autocompletion(),
    rectangularSelection(),
    crosshairCursor(),
    highlightActiveLine(),
    highlightSelectionMatches(),
    keymap.of([
        indentWithTab,
        ...closeBracketsKeymap,
        ...defaultKeymap,
        ...historyKeymap,
        ...foldKeymap,
        ...completionKeymap,
    ]),
    javascript(),
    syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
];

const small_extensions = [
    basicSetup,
    javascript({ typescript: true })
];




export function Editor(parent, doc, options = {}) {
    const initialState = EditorState.create({ doc, small_extensions });
    const view = new EditorView({ initialState, parent });

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

