import * as prettier from "https://unpkg.com/prettier@3.6.2/standalone.mjs";
import * as prettierPluginBabel from "https://unpkg.com/prettier@3.6.2/plugins/babel.mjs";
import * as prettierPluginEstree from "https://unpkg.com/prettier@3.6.2/plugins/estree.mjs";

export async function formatJavascript(text) {
    const formatted = await prettier.format(text, {
        parser: "babel",
        plugins: [prettierPluginEstree, prettierPluginBabel],
    });

    return formatted;
}

export function formatJSON(text) {
    try {
        const repaired = JSONRepair.jsonrepair(text);
        const formatted = JSON.stringify(JSON.parse(repaired), null, 2);
        return formatted;
    } catch (err) {
        console.error(err)
    }
}

