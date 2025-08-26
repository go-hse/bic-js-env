import * as fs from 'fs';
import { fileURLToPath } from 'url'
import { dirname, basename, extname, join } from 'path'


function moduleInfos(url) {
    const __filename = fileURLToPath(url);
    const __extension = extname(__filename);
    const __basename = basename(__filename, __extension);
    const __dirname = dirname(__filename);
    return { __filename, __dirname, __basename, __extension };
}

const { __filename, __dirname } = moduleInfos(import.meta.url);
const dateFilePath = join(__dirname, "..", "html", "js", "compiled.mjs");

const now = new Date();
const formatted = now.toLocaleString(); // z. B. "16.7.2025, 14:23:45"
const src = `export function compiled_date() {return {COMPILED: "${formatted}"};}`;
fs.writeFileSync(dateFilePath, src);


