const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlInlineScriptPlugin = require('html-inline-script-webpack-plugin');

const HtmlInlineCssPlugin = require('html-inline-css-webpack-plugin').default;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');


const nm_path = path.resolve(__dirname, "node_modules");
const src_path = path.resolve(__dirname, "src", "html");
const entry = path.resolve(src_path, "index.js");

console.log("\nRestart", new Date());

module.exports = {
    entry,
    output: {
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
    resolve: {
        alias: {
            "PrettierPlugins": path.resolve(nm_path, "prettier", "plugins")
        }
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                ],
            },
            {
                test: /\.html$/i,
                include: path.resolve(__dirname, 'src'),
                use: 'raw-loader',
            }
        ],
    },
    devtool: "source-map",
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                { from: 'static' }
            ]
        }),
        new HtmlWebpackPlugin({
            template: './src/html/template.html',
            title: 'JavaScript Editor',
            favicon: './src/html/img/favicon.ico',
            inject: 'body',
            minify: true
        }),
        new MiniCssExtractPlugin({
            filename: 'styles.css',
        }),
        new HtmlInlineCssPlugin(),
        new HtmlInlineScriptPlugin(),
    ],
    optimization: {
        runtimeChunk: true
    }
};
