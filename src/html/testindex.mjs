import { Main } from './js/client.mjs';
import { iframe } from './js/iframe.mjs';

import { faker } from '@faker-js/faker';

document.addEventListener('DOMContentLoaded', async () => {
    iframe([{ "faker": faker }]);
    Main();
});
