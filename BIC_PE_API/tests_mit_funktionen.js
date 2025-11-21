
/// 1:

let __let_string = "abc";
var __var_string = "abc";

function __timeStringFunc() {
    const now = new Date();
    const yyyy = now.getFullYear().toString();
    const mm = (now.getMonth() + 1).toString().padStart(2, "0");
    const dd = now.getDate().toString().padStart(2, "0");
    const hh = now.getHours().toString().padStart(2, "0");
    const mi = now.getMinutes().toString().padStart(2, "0");
    const sc = now.getSeconds().toString().padStart(2, "0");
    const ms = now.getMilliseconds().toString().padStart(3, "0");

    return `${dd}.${mm}.${yyyy} ${hh}:${mi}:${sc}:${ms}`;
}

var __createdTimeString = __timeStringFunc();

function __getVariablesFunc() {
    try {
        const under_score = Object.getOwnPropertyNames(globalThis).filter(n => n.includes("__"));
        return `aus der funktion ${__timeStringFunc()}, ${under_score.join(", ")}`;
    } catch (ex) {
        return ex.message;
    }
}

const result = {
    __createdTimeString,
    __timeStringFunc,
    __variables: __getVariablesFunc(),
    __getVariablesFunc
}

result;


let variables = "";

try {
    variables = __getVariablesFunc();
} catch (ex) {
    variables = ex.message;
}

const output = {
    variables
}

output;

