import prettier from "prettier";
import prettierPluginEstree from "PrettierPlugins/estree.mjs";
import prettierPluginBabel from "PrettierPlugins/babel.mjs";

import { jsonrepair } from 'jsonrepair'

export async function formatJavascript(text) {

    try {
        const formatted = await prettier.format(text, {
            parser: "babel",
            plugins: [prettierPluginEstree, prettierPluginBabel],
        });
        return formatted;
    } catch (err) {
        // return original text with errors; will be catched
        return text;
    }


    return formatted;
}

export function formatJSON(text) {
    try {
        const repaired = jsonrepair(text);
        const formatted = JSON.stringify(JSON.parse(repaired), null, 2);
        return formatted;
    } catch (err) {
        console.error(err)
    }
}

