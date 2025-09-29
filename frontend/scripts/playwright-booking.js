// Playwright script to open the storefront, navigate to a service page, open booking modal, fill and submit booking form
// Run: node frontend/scripts/playwright-booking.js

(async () => {
  const { chromium } = await import('playwright');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  page.on('console', msg => {
    console.log('PAGE:', msg.type(), msg.text());
    for (const arg of msg.args()) arg.jsonValue().then(v => console.log('  ARG:', v)).catch(()=>{});
  });
  page.on('pageerror', e => console.error('PAGE ERROR:', e));
  page.on('requestfailed', req => console.error('REQ FAIL:', req.url(), req.failure()?.errorText));
  page.on('response', async res => {
    if (!res.ok()) {
      try { const t = await res.text(); console.error('NON-OK', res.status(), res.url(), t.substring(0,200)); } catch {};
    }
  });

  const base = process.env.FRONTEND_BASE || 'http://localhost:3000';
  const slug = process.env.SERVICE_SLUG || 'tu-van-am-thanh';
  const url = `${base}/services/${slug}`;
  console.log('Navigating to', url);

  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Try to click the booking button (text content 'Đặt lịch ngay' or button with role)
  const bookButton = await page.$('text=Đặt lịch') || await page.$('text=Đặt lịch ngay') || await page.$('button:has-text("Đặt lịch")');
  if (!bookButton) {
    console.error('Booking button not found on page');
    await browser.close();
    process.exit(1);
  }

  console.log('Clicking booking button');
  await bookButton.click();
  await page.waitForTimeout(500);

  // Fill form fields (common labels)
  // selectors may vary; try a few common ones
  const nameSel = await page.$('input[name="customerName"]') || await page.$('input[placeholder*="Họ và tên"]');
  const phoneSel = await page.$('input[name="customerPhone"]') || await page.$('input[placeholder*="Số điện thoại"]');
  const addrSel = await page.$('input[name="customerAddress"]') || await page.$('input[placeholder*="Địa chỉ"]');
  const dateSel = await page.$('input[name="scheduledDate"]') || await page.$('input[type="date"]');
  const timeSel = await page.$('input[name="scheduledTime"]') || await page.$('input[placeholder*="Giờ"]');

  if (nameSel) await nameSel.fill('Test Khách');
  if (phoneSel) await phoneSel.fill('0900000000');
  if (addrSel) await addrSel.fill('123 Test St');
  if (dateSel) await dateSel.fill(new Date(Date.now()+24*60*60*1000).toISOString().slice(0,10));
  if (timeSel) await timeSel.fill('10:00');

  // submit button
  const confirmBtn = await page.$('button:has-text("Xác nhận đặt lịch")') || await page.$('button:has-text("Đặt lịch")') || await page.$('text=Xác nhận đặt lịch');
  if (!confirmBtn) {
    console.error('Confirm booking button not found');
    await browser.close();
    process.exit(1);
  }

  console.log('Submitting booking');
  await confirmBtn.click();

  // wait for network activity and confirmation toast
  await page.waitForTimeout(3000);

  console.log('Finished, closing');
  await browser.close();
})();
