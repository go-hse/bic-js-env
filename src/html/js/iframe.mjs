
export function iframe() {
    const iframeEle = document.createElement(`iframe`);
    iframeEle.setAttribute("id", "sandbox");
    iframeEle.setAttribute("sandbox", "allow-same-origin allow-scripts allow-popups allow-forms");
    iframeEle.onload = function (ele) {

        function evalInScope(code, contextAsScope) {
            console.log("call", code, contextAsScope);
            return new Function(`with (this) { return eval(${JSON.stringify(code)}); }`).call(contextAsScope);
        }

        const console = {
            log: (...args) => window.parent.postMessage({ type: 'log', data: args.join(' ') }, '*'),
            error: (...args) => window.parent.postMessage({ type: 'error', data: args.join(' ') }, '*')
        };

        console.log(`myframe is loaded`, ele);

        const context = { console };
        Object.assign(context, formulajs);

        evalInScope(`for(let i=0; i<3; ++i) console.log(i);`, context);

        ele.target.contentWindow.addEventListener('message', function (event) {

            const { code, globals } = event.data;
            if (typeof globals === 'object' && globals !== null) {
                Object.assign(context, globals);
            }

            try {
                const result = evalInScope(code, context);

                if (result !== undefined) {
                    let output;
                    if (typeof result === 'object' && result !== null) {
                        try {
                            output = JSON.stringify(result, null, 2);
                        } catch (e) {
                            output = '[object with circular reference]';
                        }
                    } else {
                        output = String(result);
                    }
                    window.parent.postMessage({ type: 'result', data: output }, '*');
                }
            } catch (e) {
                window.parent.postMessage({ type: 'error', data: e.message }, '*');
            }
        });



    };
    document.body.appendChild(iframeEle);
}