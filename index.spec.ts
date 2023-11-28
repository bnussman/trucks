import { test } from '@playwright/test';

test('Toyota', async ({ page }) => {
  await page.goto('https://www.toyota.com/search-inventory/model/tacoma/?zipcode=28270');

  page.on('response', (response) => {
    console.log('<<', response.status(), response.url())
  });
});
