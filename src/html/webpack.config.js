const fs = require('fs');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlInlineScriptPlugin = require('html-inline-script-webpack-plugin');

const distPath = path.resolve(__dirname, "..", "..", 'dist');
console.log("Export to", distPath);

module.exports = {
    entry: './js/client.mjs', // Haupt-JavaScript-Datei
    output: {
        filename: 'bundle.js',
        path: distPath,
        clean: true
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'], // CSS wird inline ins JS eingebettet
            },
            {
                test: /\.html$/i,
                loader: 'html-loader', // optional für HTML-Include
                options: {
                    sources: false,
                },
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html',
            inject: 'body', // Bundle wird automatisch eingebettet
        }),
        new HtmlInlineScriptPlugin()
    ],
    mode: 'production',
};
