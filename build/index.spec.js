"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
(0, test_1.test)('Toyota', async ({ page }) => {
    await page.goto('https://www.toyota.com/search-inventory/model/tacoma/?zipcode=28270');
    page.on('response', (response) => {
        console.log('<<', response.status(), response.url());
    });
});
