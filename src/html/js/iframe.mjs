
import * as formulajs from "@formulajs/formulajs"

function wrap(code) {
    return `
    try {
        ${code}
    } catch(ex) {
       console.log("wrapped", ex);
    }
    `;

}

export function iframe() {
    const iframeEle = document.createElement(`iframe`);
    iframeEle.setAttribute("id", "sandbox");
    iframeEle.setAttribute("sandbox", "allow-same-origin allow-scripts allow-popups allow-forms");


    iframeEle.onload = function (ele) {
        const localDocument = iframeEle.contentWindow.document;

        // function runCode(code) {
        //     const jsEle = localDocument.createElement('script');
        //     jsEle.innerHTML = wrap(code);
        //     localDocument.head.appendChild(jsEle);
        //     localDocument.head.removeChild(jsEle)
        // }


        function safeEvalInScope(code, contextAsScope, name = "code.js") {
            const wrappedCode = code + `\n//# sourceURL=${name}`;
            try {
                // Erzeuge Funktion mit eval im Scope
                const fn = new Function(
                    `with (this) { return eval(${JSON.stringify(wrappedCode)}); }`
                );
                return { result: fn.call(contextAsScope), error: null };
            } catch (e) {
                let line = null, col = null, file = name;
                let snippet = null;

                // Stacktrace versuchen auszuwerten
                if (e.stack) {
                    const lines = e.stack.split("\n");
                    for (let l of lines) {
                        const match = l.match(/(.*?):(\d+):(\d+)/);
                        if (match) {
                            file = match[1];
                            line = parseInt(match[2], 10);
                            col = parseInt(match[3], 10);
                            break;
                        }
                    }
                }

                // Falls wir eine Zeilennummer haben, extrahiere die fehlerhafte Zeile
                if (line && line <= code.split("\n").length) {
                    const codeLines = code.split("\n");
                    const errorLine = codeLines[line - 1];
                    snippet = errorLine;
                }

                return {
                    result: null,
                    error: {
                        name: e.name,
                        message: e.message,
                        file,
                        line,
                        column: col,
                        snippet,
                        stack: e.stack
                    }
                };
            }
        }


        function evalInScope(code, contextAsScope, name = "code.js") {
            const wrappedCode = code + `\n//# sourceURL=${name}`;
            // console.log("call", code, contextAsScope);
            return new Function(`with (this) { return eval(${JSON.stringify(wrappedCode)}); }`).call(contextAsScope);
        }

        const console = {
            log: (...args) => window.parent.postMessage({ type: 'log', data: args.join(' ') }, '*'),
            error: (...args) => window.parent.postMessage({ type: 'error', data: args.join(' ') }, '*')
        };

        // console.log(`myframe is loaded`, ele);

        const context = { console };
        Object.assign(context, formulajs);

        // evalInScope(`for(let i=0; i<3; ++i) console.log(i);`, context);

        ele.target.contentWindow.addEventListener('message', function (event) {

            const { code, globals } = event.data;
            if (typeof globals === 'object' && globals !== null) {
                Object.assign(context, globals);
            }

            try {
                const result = safeEvalInScope(code, context);

                if (result.result !== null) {
                    let output;
                    if (typeof result.result === 'object') {
                        try {
                            output = JSON.stringify(result.result, null, 2);
                        } catch (e) {
                            output = '[object with circular reference]';
                        }
                    } else {
                        output = String(result);
                    }
                    window.parent.postMessage({ type: 'result', data: output }, '*');
                }

                if (result.result === null && result.error) {
                    window.parent.postMessage({ type: 'error', data: { message: result.error.message, line: result.error.line, snippet: result.error.snippet } }, '*');
                }
            } catch (e) {
                const stackLines = e.stack.split("\n");
                console.log("Stacktrace:", stackLines);

                const firstFrame = stackLines[1];
                const match = firstFrame.match(/:(\d+):(\d+)\)?$/);
                let lineNo, colmNo;
                if (match) {
                    lineNo = match[1];
                    colmNo = match[2];
                }
                window.parent.postMessage({ type: 'error', data: { message: e.message, lineNo, colmNo } }, '*');
            }
        });



    };
    document.body.appendChild(iframeEle);
}