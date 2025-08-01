import prettier from "/node_modules/prettier/standalone.mjs";
import prettierPluginEstree from "/node_modules/prettier/plugins/estree.mjs";
import prettierPluginBabel from "/node_modules/prettier/plugins/babel.mjs";

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

