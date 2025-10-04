import './css/style.css';
import { Main } from './js/client.mjs';
import { iframe } from './js/iframe.mjs';
import * as formulajs from "@formulajs/formulajs"

document.addEventListener('DOMContentLoaded', () => {
    iframe(formulajs);
    Main();
});
