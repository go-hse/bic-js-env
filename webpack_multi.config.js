const path = require('path');


const nm_path = path.resolve(__dirname, "node_modules");
const src_path = path.resolve(__dirname, "src", "webpack_test");
const entry = path.resolve(src_path, "index.js");

console.log("\nRestart", nm_path);

module.exports = [
    "eval",
    "eval-cheap-source-map",
    "eval-cheap-module-source-map",
    "eval-source-map",
    "cheap-source-map",
    "cheap-module-source-map",
    "inline-cheap-source-map",
    "inline-cheap-module-source-map",
    "source-map",
    "inline-source-map",
    "hidden-source-map",
    "nosources-source-map"
].map(devtool => ({
    mode: "development",
    entry,
    output: {
        path: path.join(src_path, "dist"),
        filename: `./[name]-${devtool}.js`
    },
    devtool,
    resolve: {
        alias: {
            "PrettierPlugins": path.resolve(nm_path, "prettier", "plugins")
        }
    },
    optimization: {
        runtimeChunk: true
    }
}));