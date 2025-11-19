import './css/style.css';
import { Main } from './js/client.mjs';
import { iframe } from './js/iframe.mjs';
import * as formulajs from "@formulajs/formulajs"
import { faker } from '@faker-js/faker';

document.addEventListener('DOMContentLoaded', () => {
    iframe([
        { "faker": faker },
        { "formulajs": formulajs }
    ]);

    Main();
});
