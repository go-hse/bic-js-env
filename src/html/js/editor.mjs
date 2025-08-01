
export function Editor(win, initialText) {
    const initialState = cm6.createEditorState(initialText);
    const view = cm6.createEditorView(initialState, win.contentElement);

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