/* Umt3D Studio — tarayıcı tabanlı testler (Playwright + Chromium).
   Kullanım: node tests/run-tests.js            (proje kökünden)
   Yerel bir HTTP sunucusu açar, sayfaları yükler ve kontrolleri çalıştırır. */
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const path = require('path');

const PORT = 8790;
const BASE = `http://localhost:${PORT}`;
let failures = 0, passes = 0;

function check(name, cond, detail){
  if(cond){ passes++; console.log('  ✓ ' + name); }
  else { failures++; console.log('  ✗ ' + name + (detail !== undefined ? ' → ' + JSON.stringify(detail) : '')); }
}
function near(a, b, eps){ return Math.abs(a - b) <= eps; }

(async () => {
  const root = path.resolve(__dirname, '..');
  const server = spawn('python3', ['-m', 'http.server', String(PORT)], { cwd: root, stdio: 'ignore' });
  await new Promise(r => setTimeout(r, 700));
  const browser = await chromium.launch();
  try{
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));

    await page.goto(BASE + '/calculator.html', { waitUntil: 'load' });
    await page.waitForFunction(() => window.Umt3D !== undefined);

    console.log('G-code ayrıştırma');
    const prusa = await page.evaluate(() => window.Umt3D.parseGcode(
      '; filament used [g] = 12.34, 5.66\n; estimated printing time (normal mode) = 1h 2m 3s', 1.24));
    check('PrusaSlicer gramajı toplanır (12.34 + 5.66)', near(prusa.weightG, 18, 0.001), prusa.weightG);
    check('PrusaSlicer süresi dakikaya çevrilir (1s 2dk 3sn ≈ 62)', prusa.minutes === 62, prusa.minutes);

    const cura = await page.evaluate(() => window.Umt3D.parseGcode(';Filament weight = 20.5\n;TIME:3600', 1.24));
    check('Cura gramajı okunur', near(cura.weightG, 20.5, 0.001), cura.weightG);
    check('Cura TIME (saniye) dakikaya çevrilir', cura.minutes === 60, cura.minutes);

    const empty = await page.evaluate(() => window.Umt3D.parseGcode('G28\nG1 X10 Y10', 1.24));
    check('Bilinmeyen dosyada değerler boş döner', empty.weightG === null && empty.minutes === null, empty);

    console.log('Süre ve uzunluk yardımcıları');
    const dur = await page.evaluate(() => window.Umt3D.parseDurationToMinutes('2d 1h'));
    check('"2d 1h" = 2940 dakika', dur === 2940, dur);
    const g = await page.evaluate(() => window.Umt3D.lengthToGrams(1000, 1.75, 1.24));
    check('1000 mm 1,75 mm PLA ≈ 2,98 g', near(g, 2.98, 0.02), g);

    console.log('Fiyat listesi');
    await page.evaluate(() => localStorage.setItem('umt3d_prices_v1', JSON.stringify({'f:pla': 999})));
    await page.reload({ waitUntil: 'load' });
    await page.waitForFunction(() => window.Umt3D !== undefined);
    const overridden = await page.evaluate(() => window.Umt3D.MATERIALS.find(m => m.id === 'pla').price);
    check('Kullanıcı fiyatı uygulanır (999)', overridden === 999, overridden);
    await page.evaluate(() => localStorage.removeItem('umt3d_prices_v1'));
    await page.reload({ waitUntil: 'load' });
    await page.waitForFunction(() => window.Umt3D !== undefined);
    const reset = await page.evaluate(() => window.Umt3D.MATERIALS.find(m => m.id === 'pla').price);
    check('Fiyat sıfırlanınca varsayılana döner (650)', reset === 650, reset);

    console.log('Yedekleme');
    await page.evaluate(() => localStorage.setItem('umt3d_batch_v1', JSON.stringify([{name:'Test', qty:2, unit:100}])));
    const backup = await page.evaluate(() => window.Umt3D.exportBackupJSON());
    check('Yedek geçerli JSON ve uygulama imzası taşır', JSON.parse(backup).app === 'umt3d-studio');
    await page.evaluate(() => localStorage.removeItem('umt3d_batch_v1'));
    const restored = await page.evaluate((b) => window.Umt3D.importBackupJSON(b), backup);
    const batchBack = await page.evaluate(() => localStorage.getItem('umt3d_batch_v1'));
    check('Yedekten geri yükleme toplu listeyi geri getirir', restored >= 1 && batchBack && JSON.parse(batchBack)[0].name === 'Test', batchBack);
    let rejected = false;
    try{ await page.evaluate(() => window.Umt3D.importBackupJSON('{"app":"baska","data":{}}')); }catch(e){ rejected = true; }
    check('Başka uygulamanın dosyası reddedilir', rejected);
    await page.evaluate(() => localStorage.removeItem('umt3d_batch_v1'));

    console.log('CSV dışa aktarım');
    const csv = await page.evaluate(() => window.Umt3D.toCsv([['Parça','Tutar'],['Kutu; büyük','1,5'],['Say "x"','2']]));
    check('CSV BOM ile başlar', csv.charCodeAt(0) === 0xFEFF);
    check('CSV noktalı virgül ayırıcı kullanır', csv.includes('Parça;Tutar'));
    check('CSV içindeki ; ve " alanları kaçırılır', csv.includes('"Kutu; büyük"') && csv.includes('"Say ""x"""'), csv);

    console.log('Sayfa iskeleti ve erişilebilirlik');
    for (const f of ['index.html','calculator.html','faq.html','privacy.html','blog.html','oneri.html','hakkinda.html','iletisim.html','kosullar.html','yazi-gcode-nasil-okunur.html','404.html']){
      await page.goto(BASE + '/' + f, { waitUntil: 'load' });
      const info = await page.evaluate(() => ({
        skip: !!document.querySelector('.skip-link'),
        main: !!document.getElementById('main'),
        canonical: !!document.querySelector('link[rel="canonical"]'),
        og: !!document.querySelector('meta[property="og:title"]'),
        unlabeledThemeBtn: [...document.querySelectorAll('.theme-toggle button')].filter(b => !b.getAttribute('aria-label')).length
      }));
      check(`${f}: atlama bağlantısı + hedef`, info.skip && info.main, info);
      check(`${f}: canonical ve Open Graph`, info.canonical && info.og);
      check(`${f}: tema düğmeleri etiketli`, info.unlabeledThemeBtn === 0, info.unlabeledThemeBtn);
    }
    check('Sayfa hatası yok (son sayfa)', errors.length === 0, errors);
  } finally {
    await browser.close();
    server.kill();
  }
  console.log(`\n${passes} geçti, ${failures} başarısız`);
  process.exit(failures ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
