const path = require('path');


const nm_path = path.resolve(__dirname, "node_modules");
const src_path = path.resolve(__dirname, "src", "webpack_test");
const entry = path.resolve(src_path, "index.js");

console.log("\nRestart", nm_path);

module.exports = {
    entry,
    output: {
        path: path.resolve(src_path, 'dist'),
        filename: "bundle.js"
    },
    resolve: {
        alias: {
            "PrettierPlugins": path.resolve(nm_path, "prettier", "plugins")
        }
    }
};
