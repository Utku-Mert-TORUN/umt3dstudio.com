/* Umt3D Studio — cost & quote calculator logic. Runs entirely client-side. */
(function(){
"use strict";

/* ---------------- i18n ---------------- */
var STR = {
  tr:{
    eyebrow:"OTOMATİK FİYATLANDIRMA",
    heroTitle:"Baskıyı yükle, fiyatı al.",
    heroSub:"G-code dosyanı sürükle, malzeme ve yazıcını seç — gram, süre ve watt bilgisini sen yazmana gerek kalmadan dolduralım. Geri kalan ayarları bir kez gir, tarayıcın hatırlasın.",
    h1t:"Dosya ile otomatik doldur", h1s:"Cura, PrusaSlicer, OrcaSlicer, Bambu Studio veya Simplify3D çıktısı .gcode / .bgcode / .gco dosyaları desteklenir.",
    dropT1:"G-code dosyasını buraya bırak", dropT2:"ya da tıklayıp seç — hiçbir şey sunucuya yüklenmez, her şey tarayıcında kalır",
    h2t:"Baskı türü, malzeme, yazıcı", h2s:"Yoğunluk ve güç tüketimi otomatik gelir, istersen üzerine yaz.",
    modeFdm:"FDM (Filament)", modeResin:"Reçine (Resin)",
    lblMaterial:"Malzeme", lblPrinter:"Yazıcı", lblWeight:"Filament ağırlığı", lblDensity:"Yoğunluk",
    lblFilPrice:"Filament fiyatı", lblWatt:"Yazıcı gücü", lblResinVol:"Reçine hacmi", lblResinPrice:"Reçine fiyatı",
    lblResinWatt:"Yazıcı + UV küvet gücü", lblConsumables:"Sarf malzeme (IPA, eldiven vb.)",
    lblResinMaterial:"Reçine türü", lblResinPrinter:"Reçine yazıcısı",
    lblBrand:"Marka (opsiyonel)", brandPh:"örn. eSUN, Polymaker, Prusament, Bambu Lab",
    lblColor:"Renk",
    lblTime:"Baskı süresi", unitH:"sa", unitM:"dk", lblElec:"Elektrik birim fiyatı",
    h3t:"İşletme maliyetleri", h3s:"Bu bölüm tarayıcında saklanır, bir daha girmen gerekmez.",
    lblFail:"Fire / başarısız baskı payı", lblPost:"Son işlem / işçilik maliyeti",
    lblLaborRate:"Saatlik emek ücreti", lblLaborTime:"Harcanan emek süresi", unitMin:"dk",
    depToggle:"Yazıcı amortismanı ekle", depToggleSub:"Makine aşınma payını maliyete dahil et",
    lblPrinterCost:"Yazıcı maliyeti", lblLifetime:"Beklenen ömür", unitHours:"saat",
    lblMargin:"Kâr marjı", lblFx:"Döviz kuru (₺ başına)",
    ticketTitle:"Maliyet Fişi", btnQuote:"Müşteri Teklifi Oluştur", savedMsg:"Ayarların kaydedildi",
    quoteHeadTitle:"Teklif Bilgileri", lblBizName:"İşletme adı", lblCustName:"Müşteri adı", lblPartName:"Parça / proje adı",
    btnCopy:"📋 Panoya Kopyala", footer:"Tüm hesaplamalar tarayıcında yapılır, hiçbir veri sunucuya gönderilmez.",
    rowMaterial:"Malzeme maliyeti", rowElec:"Elektrik maliyeti", rowFail:"Fire payı", rowPost:"Son işlem / işçilik",
    rowDep:"Makine amortismanı", rowSubtotal:"Ara toplam (maliyet)", rowMargin:"Kâr marjı", rowTotal:"Müşteriye Fiyat",
    noFile:"Dosya tespit edilemedi, verileri elle gir.", fileOkWeight:"gram", fileOkTime:"süre",
    parsedBoth:"dosyadan okundu:", parsedPartial:"kısmen okundu, eksikleri elle tamamla:",
    parsedNone:"Bu dosyada tanınan bir slicer imzası bulunamadı. Gram ve süreyi elle girebilirsin.",
    fxMissing:"Kur girilmedi, tutarlar ₺ olarak gösteriliyor.",
    auto:"otomatik", quoteCopied:"Teklif panoya kopyalandı ✓", perHour:"/sa", qtyLabel:"adet",
    dateLocale:"tr-TR"
  },
  en:{
    eyebrow:"AUTOMATED PRICING",
    heroTitle:"Upload the print, get the price.",
    heroSub:"Drop your G-code, pick your material and printer — we fill in weight, time and wattage so you don't have to type them. Set the rest once and your browser remembers it.",
    h1t:"Auto-fill from a file", h1s:"Supports .gcode / .bgcode / .gco output from Cura, PrusaSlicer, OrcaSlicer, Bambu Studio or Simplify3D.",
    dropT1:"Drop your G-code file here", dropT2:"or click to browse — nothing is uploaded, everything stays in your browser",
    h2t:"Print type, material, printer", h2s:"Density and power draw fill in automatically — override if you like.",
    modeFdm:"FDM (Filament)", modeResin:"Resin",
    lblMaterial:"Material", lblPrinter:"Printer", lblWeight:"Filament weight", lblDensity:"Density",
    lblFilPrice:"Filament price", lblWatt:"Printer power", lblResinVol:"Resin volume", lblResinPrice:"Resin price",
    lblResinWatt:"Printer + UV tank power", lblConsumables:"Consumables (IPA, gloves, etc.)",
    lblResinMaterial:"Resin type", lblResinPrinter:"Resin printer",
    lblBrand:"Brand (optional)", brandPh:"e.g. eSUN, Polymaker, Prusament, Bambu Lab",
    lblColor:"Color",
    lblTime:"Print time", unitH:"h", unitM:"min", lblElec:"Electricity rate",
    h3t:"Business costs", h3s:"This section is saved in your browser — you won't need to enter it again.",
    lblFail:"Failure / waste allowance", lblPost:"Post-processing / finishing cost",
    lblLaborRate:"Hourly labor rate", lblLaborTime:"Labor time spent", unitMin:"min",
    depToggle:"Add printer depreciation", depToggleSub:"Include machine wear in the cost",
    lblPrinterCost:"Printer cost", lblLifetime:"Expected lifetime", unitHours:"hours",
    lblMargin:"Profit margin", lblFx:"Exchange rate (per ₺)",
    ticketTitle:"Cost Ticket", btnQuote:"Create Customer Quote", savedMsg:"Settings saved",
    quoteHeadTitle:"Quote Details", lblBizName:"Business name", lblCustName:"Customer name", lblPartName:"Part / project name",
    btnCopy:"📋 Copy to Clipboard", footer:"All calculations run in your browser — no data is sent anywhere.",
    rowMaterial:"Material cost", rowElec:"Electricity cost", rowFail:"Failure allowance", rowPost:"Post-processing / labor",
    rowDep:"Machine depreciation", rowSubtotal:"Subtotal (cost)", rowMargin:"Profit margin", rowTotal:"Customer Price",
    noFile:"Couldn't detect file data, enter values manually.", fileOkWeight:"grams", fileOkTime:"time",
    parsedBoth:"read from file:", parsedPartial:"partially read, fill in the rest manually:",
    parsedNone:"No recognized slicer signature found in this file. You can enter weight and time manually.",
    fxMissing:"No exchange rate set — amounts are shown in ₺.",
    auto:"auto", quoteCopied:"Quote copied to clipboard ✓", perHour:"/hr", qtyLabel:"qty",
    dateLocale:"en-US"
  }
};
var lang = "tr";
function t(k){ return (STR[lang] && STR[lang][k]) || k; }
function applyI18n(){
  document.querySelectorAll("[data-i18n]").forEach(function(el){
    var k = el.getAttribute("data-i18n");
    el.textContent = t(k);
  });
  document.querySelectorAll("[data-i18n-ph]").forEach(function(el){
    el.placeholder = t(el.getAttribute("data-i18n-ph"));
  });
  document.title = lang === "tr" ? "Hesaplayıcı — Umt3D Studio" : "Calculator — Umt3D Studio";
  renderColorSwatches();
  render();
}

/* ---------------- storage ---------------- */
var STORE_KEY = "umt3d_calc_profile_v1";
function loadProfile(){
  try{
    var raw = localStorage.getItem(STORE_KEY);
    return raw ? JSON.parse(raw) : null;
  }catch(e){ return null; }
}
function saveProfile(){
  try{
    var data = {
      lang: lang, currency: currency,
      elecPrice: $("elecPrice").value, filPrice: $("filPrice").value,
      failRate: $("failRate").value, postProcess: $("postProcess").value,
      laborRate: $("laborRate").value, margin: $("margin").value,
      depToggle: $("depToggle").checked, printerCost: $("printerCost").value,
      lifetimeHours: $("lifetimeHours").value, fxRate: $("fxRate").value,
      bizName: $("bizName") ? $("bizName").value : "", material: $("material").value,
      printer: $("printer").value, resinPrice: $("resinPrice").value,
      materialBrand: $("materialBrand") ? $("materialBrand").value : "",
      color: selectedColor,
      resinMaterial: $("resinMaterial") ? $("resinMaterial").value : "",
      resinPrinter: $("resinPrinter") ? $("resinPrinter").value : ""
    };
    localStorage.setItem(STORE_KEY, JSON.stringify(data));
    var pill = $("savedPill");
    pill.classList.add("show");
    clearTimeout(window.__savedTimer);
    window.__savedTimer = setTimeout(function(){ pill.classList.remove("show"); }, 1600);
  }catch(e){ /* storage unavailable, ignore */ }
}

/* ---------------- data: materials & printers ---------------- */
var MATERIALS = [
  {id:"pla", tr:"PLA", en:"PLA", density:1.24, price:650},
  {id:"pla_silk", tr:"PLA Silk", en:"Silk PLA", density:1.23, price:750},
  {id:"pla_matte", tr:"PLA Mat", en:"Matte PLA", density:1.24, price:750},
  {id:"pla_wood", tr:"PLA Ahşap Dolgulu", en:"PLA Wood-fill", density:1.15, price:900},
  {id:"pla_glow", tr:"PLA Karanlıkta Parlayan", en:"PLA Glow-in-the-dark", density:1.26, price:1050},
  {id:"pla_marble", tr:"PLA Mermer Desenli", en:"PLA Marble", density:1.25, price:950},
  {id:"pla_metal", tr:"PLA Metal Dolgulu (Bronz/Bakır)", en:"PLA Metal-fill (Bronze/Copper)", density:1.75, price:1900},
  {id:"petg", tr:"PETG", en:"PETG", density:1.27, price:750},
  {id:"petg_cf", tr:"PETG Karbon Fiber", en:"PETG Carbon Fiber", density:1.30, price:1600},
  {id:"abs", tr:"ABS", en:"ABS", density:1.04, price:700},
  {id:"asa", tr:"ASA", en:"ASA", density:1.05, price:850},
  {id:"tpu85", tr:"TPU 85A (Çok Esnek)", en:"TPU 85A (Very Flexible)", density:1.20, price:1200},
  {id:"tpu95", tr:"TPU 95A (Esnek)", en:"TPU 95A (Flexible)", density:1.21, price:1100},
  {id:"nylon", tr:"Naylon (PA)", en:"Nylon (PA)", density:1.14, price:1600},
  {id:"nylon_cf", tr:"Naylon Karbon Fiber (PA-CF)", en:"Nylon Carbon Fiber (PA-CF)", density:1.19, price:2400},
  {id:"pahtcf", tr:"PAHT-CF", en:"PAHT-CF", density:1.19, price:2600},
  {id:"pc", tr:"Polikarbonat (PC)", en:"Polycarbonate (PC)", density:1.19, price:1700},
  {id:"pp", tr:"Polipropilen (PP)", en:"Polypropylene (PP)", density:0.90, price:1300},
  {id:"hips", tr:"HIPS", en:"HIPS", density:1.03, price:750},
  {id:"pva", tr:"PVA (Destek)", en:"PVA (Support)", density:1.23, price:2200},
  {id:"cf_pla", tr:"Karbon Fiber PLA", en:"Carbon Fiber PLA", density:1.30, price:1500},
  {id:"gf_pla", tr:"Cam Fiber PLA (GF)", en:"Glass Fiber PLA (GF)", density:1.33, price:1400},
  {id:"wood", tr:"Ahşap Dolgulu (PLA değil)", en:"Wood-fill (non-PLA base)", density:1.15, price:900},
  {id:"custom_fdm", tr:"Özel / Diğer", en:"Custom / Other", density:1.24, price:700}
];

var RESIN_MATERIALS = [
  {id:"standard", tr:"Standart Reçine", en:"Standard Resin", price:1400},
  {id:"tough_abs", tr:"Sert / ABS-benzeri Reçine", en:"Tough / ABS-like Resin", price:1900},
  {id:"flexible", tr:"Esnek Reçine", en:"Flexible Resin", price:2200},
  {id:"water_wash", tr:"Suda Yıkanabilir Reçine", en:"Water-washable Resin", price:1600},
  {id:"castable", tr:"Dökülebilir Reçine (Mücevher)", en:"Castable Resin (Jewelry)", price:3200},
  {id:"dental", tr:"Dental / Biyouyumlu Reçine", en:"Dental / Biocompatible Resin", price:4200},
  {id:"high_temp", tr:"Yüksek Sıcaklık Reçinesi", en:"High-Temp Resin", price:2800},
  {id:"custom_resin", tr:"Özel / Diğer", en:"Custom / Other", price:1800}
];

var COLORS = [
  {id:"black", tr:"Siyah", en:"Black", hex:"#1A1A1A"},
  {id:"white", tr:"Beyaz", en:"White", hex:"#F5F5F2"},
  {id:"gray", tr:"Gri", en:"Gray", hex:"#9A9A9A"},
  {id:"silver", tr:"Gümüş", en:"Silver", hex:"#C6C9CC"},
  {id:"red", tr:"Kırmızı", en:"Red", hex:"#E3362A"},
  {id:"orange", tr:"Turuncu", en:"Orange", hex:"#F2792B"},
  {id:"yellow", tr:"Sarı", en:"Yellow", hex:"#F3C230"},
  {id:"gold", tr:"Altın", en:"Gold", hex:"#C9A227"},
  {id:"green", tr:"Yeşil", en:"Green", hex:"#3DA35D"},
  {id:"blue", tr:"Mavi", en:"Blue", hex:"#2E6FEE"},
  {id:"skyblue", tr:"Gök Mavisi", en:"Sky Blue", hex:"#5CC3E8"},
  {id:"purple", tr:"Mor", en:"Purple", hex:"#8A4FD1"},
  {id:"pink", tr:"Pembe", en:"Pink", hex:"#F06BA8"},
  {id:"brown", tr:"Kahverengi", en:"Brown", hex:"#8A5A3B"},
  {id:"clear", tr:"Şeffaf", en:"Clear", hex:"#E8EEF2"},
  {id:"natural", tr:"Doğal (Renksiz)", en:"Natural", hex:"#EDE3CF"}
];

var PRINTERS = [
  {group:"Creality", items:[
    {id:"ender3", name:"Ender 3 / 3 Pro", w:120},
    {id:"ender3v2", name:"Ender 3 V2 / Neo", w:150},
    {id:"ender3s1", name:"Ender 3 S1 / S1 Pro", w:170},
    {id:"ender3v3", name:"Ender 3 V3 / V3 SE / KE", w:160},
    {id:"ender5", name:"Ender 5 / 5 Plus", w:160},
    {id:"ender5s1", name:"Ender 5 S1", w:180},
    {id:"cr6se", name:"CR-6 SE", w:150},
    {id:"cr10", name:"CR-10 / CR-10S", w:220},
    {id:"cr10smart", name:"CR-10 Smart / Smart Pro", w:230},
    {id:"k1", name:"K1", w:280},
    {id:"k1c", name:"K1C", w:280},
    {id:"k1max", name:"K1 Max", w:320},
    {id:"sermoon", name:"Sermoon V1 / D3", w:130}
  ]},
  {group:"Prusa Research", items:[
    {id:"mk3s", name:"i3 MK3S+", w:120},
    {id:"mk4", name:"MK4 / MK4S", w:150},
    {id:"mini", name:"MINI+", w:90},
    {id:"xl", name:"XL", w:260},
    {id:"coreone", name:"CORE One", w:180}
  ]},
  {group:"Bambu Lab", items:[
    {id:"x1", name:"X1", w:170},
    {id:"x1c", name:"X1 Carbon", w:180},
    {id:"x1e", name:"X1E", w:220},
    {id:"p1p", name:"P1P", w:170},
    {id:"p1s", name:"P1S", w:200},
    {id:"p2s", name:"P2S", w:210},
    {id:"a1", name:"A1", w:150},
    {id:"a1mini", name:"A1 Mini", w:90},
    {id:"h2d", name:"H2D", w:280}
  ]},
  {group:"Anycubic", items:[
    {id:"kobra2", name:"Kobra 2 / 2 Pro", w:160},
    {id:"kobra2max", name:"Kobra 2 Max", w:220},
    {id:"kobra3", name:"Kobra 3", w:180},
    {id:"vyper", name:"Vyper", w:150},
    {id:"megax", name:"Mega X / S", w:190}
  ]},
  {group:"Elegoo", items:[
    {id:"neptune3", name:"Neptune 3 / 3 Pro", w:150},
    {id:"neptune4", name:"Neptune 4 / 4 Pro", w:170},
    {id:"neptune4max", name:"Neptune 4 Max", w:220}
  ]},
  {group:"Qidi Tech", items:[
    {id:"xmax3", name:"X-Max 3", w:260},
    {id:"xplus3", name:"X-Plus 3", w:220},
    {id:"xsmart3", name:"X-Smart 3", w:140},
    {id:"q1pro", name:"Q1 Pro", w:200}
  ]},
  {group:"Flashforge", items:[
    {id:"adv3", name:"Adventurer 3 / 4", w:90},
    {id:"adv5m", name:"Adventurer 5M (Pro)", w:160},
    {id:"creatorpro", name:"Creator Pro 2", w:220},
    {id:"guider3", name:"Guider 3 Ultra", w:260}
  ]},
  {group:"Sovol", items:[
    {id:"sv06", name:"SV06 / SV06 Plus", w:150},
    {id:"sv06ace", name:"SV06 Ace", w:160},
    {id:"sv07", name:"SV07 / SV07 Plus", w:190}
  ]},
  {group:"Artillery", items:[
    {id:"sidewinderx2", name:"Sidewinder X2 / X3", w:190},
    {id:"genius", name:"Genius Pro", w:170}
  ]},
  {group:"Snapmaker", items:[
    {id:"j1", name:"J1 / J1s", w:200},
    {id:"artisan", name:"Artisan", w:230}
  ]},
  {group:"UltiMaker", items:[
    {id:"s5", name:"S5", w:220},
    {id:"method", name:"Method / Method X", w:260}
  ]},
  {group:"Voron (DIY)", items:[
    {id:"voron24", name:"Voron 2.4", w:280},
    {id:"vorontrident", name:"Voron Trident", w:260}
  ]},
  {group:"Diğer / Other", items:[
    {id:"custom", name:"Özel güç değeri / Custom wattage", w:150}
  ]}
];

var RESIN_PRINTERS = [
  {group:"Elegoo", items:[
    {id:"mars3", name:"Mars 3 / 3 Pro", w:55},
    {id:"mars4", name:"Mars 4 / 4 Ultra", w:60},
    {id:"mars5", name:"Mars 5 / 5 Ultra", w:65},
    {id:"saturn2", name:"Saturn 2 / 3", w:75},
    {id:"saturn4u", name:"Saturn 4 Ultra", w:90}
  ]},
  {group:"Anycubic", items:[
    {id:"photonm3", name:"Photon Mono M3 / M3 Plus", w:65},
    {id:"photonm3max", name:"Photon Mono M3 Max", w:90},
    {id:"photonx2", name:"Photon Mono X2", w:80},
    {id:"photon2", name:"Photon Mono 2", w:55}
  ]},
  {group:"Creality", items:[
    {id:"halotone", name:"Halot-One / One Plus", w:60},
    {id:"halotmage", name:"Halot-Mage / Mage Pro", w:85}
  ]},
  {group:"Phrozen", items:[
    {id:"sonicmini8k", name:"Sonic Mini 8K / 8K S", w:70},
    {id:"sonicmega8k", name:"Sonic Mega 8K", w:95}
  ]},
  {group:"Diğer / Other", items:[
    {id:"customresin", name:"Özel güç değeri / Custom wattage", w:70}
  ]}
];

/* ---------------- helpers ---------------- */
function $(id){ return document.getElementById(id); }
function num(id){ var v = parseFloat($(id).value); return isNaN(v) ? 0 : v; }
function fmt(n, dec){
  dec = dec === undefined ? 2 : dec;
  if(!isFinite(n)) n = 0;
  return n.toLocaleString(lang === "tr" ? "tr-TR" : "en-US", {minimumFractionDigits:dec, maximumFractionDigits:dec});
}
var CUR_SYMBOL = {TRY:"₺", USD:"$", EUR:"€"};

function populateSelects(){
  var matSel = $("material");
  matSel.innerHTML = "";
  MATERIALS.forEach(function(m){
    var o = document.createElement("option");
    o.value = m.id;
    o.textContent = (lang==="tr" ? m.tr : m.en) + "  ·  " + m.density + " g/cm³";
    matSel.appendChild(o);
  });

  var pSel = $("printer");
  pSel.innerHTML = "";
  PRINTERS.forEach(function(g){
    var og = document.createElement("optgroup");
    og.label = g.group;
    g.items.forEach(function(p){
      var o = document.createElement("option");
      o.value = p.id;
      o.textContent = p.name + "  ·  ~" + p.w + "W";
      o.dataset.w = p.w;
      og.appendChild(o);
    });
    pSel.appendChild(og);
  });

  var rmSel = $("resinMaterial");
  if(rmSel){
    rmSel.innerHTML = "";
    RESIN_MATERIALS.forEach(function(m){
      var o = document.createElement("option");
      o.value = m.id;
      o.textContent = (lang==="tr" ? m.tr : m.en);
      o.dataset.price = m.price;
      rmSel.appendChild(o);
    });
  }

  var rpSel = $("resinPrinter");
  if(rpSel){
    rpSel.innerHTML = "";
    RESIN_PRINTERS.forEach(function(g){
      var og = document.createElement("optgroup");
      og.label = g.group;
      g.items.forEach(function(p){
        var o = document.createElement("option");
        o.value = p.id;
        o.textContent = p.name + "  ·  ~" + p.w + "W";
        o.dataset.w = p.w;
        og.appendChild(o);
      });
      rpSel.appendChild(og);
    });
  }

  renderColorSwatches();
}

/* ---------------- color swatches ---------------- */
var selectedColor = "black";
function renderColorSwatches(){
  var row = $("colorRow");
  if(!row) return;
  row.innerHTML = "";
  COLORS.forEach(function(c){
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "swatch" + (c.id === selectedColor ? " active" : "");
    btn.style.background = c.hex;
    btn.title = (lang==="tr" ? c.tr : c.en);
    btn.setAttribute("aria-label", (lang==="tr" ? c.tr : c.en));
    btn.dataset.color = c.id;
    btn.addEventListener("click", function(){
      selectedColor = c.id;
      row.querySelectorAll(".swatch").forEach(function(s){ s.classList.remove("active"); });
      btn.classList.add("active");
      var label = $("colorLabel");
      if(label) label.textContent = lang==="tr" ? c.tr : c.en;
      render(); scheduleSave();
    });
    row.appendChild(btn);
  });
  var label = $("colorLabel");
  if(label){
    var cur = COLORS.find(function(c){ return c.id === selectedColor; });
    label.textContent = cur ? (lang==="tr" ? cur.tr : cur.en) : "";
  }
}

/* ---------------- G-code parsing ---------------- */
function parseDurationToMinutes(str){
  if(!str) return null;
  str = str.toLowerCase();
  if(/^\s*\d+\s*$/.test(str)){
    return Math.round(parseInt(str,10) / 60);
  }
  var norm = str
    .replace(/days?/g, "d").replace(/hours?/g, "h")
    .replace(/minutes?/g, "m").replace(/seconds?/g, "s");
  var d = /(\d+)\s*d/.exec(norm);
  var h = /(\d+)\s*h/.exec(norm);
  var m = /(\d+)\s*m(?!s)/.exec(norm);
  var s = /(\d+)\s*s/.exec(norm);
  if(!d && !h && !m && !s) return null;
  var total = 0;
  if(d) total += parseInt(d[1],10) * 24 * 60;
  if(h) total += parseInt(h[1],10) * 60;
  if(m) total += parseInt(m[1],10);
  if(s) total += parseInt(s[1],10) / 60;
  return Math.round(total);
}

function lengthToGrams(lengthMm, diameterMm, density){
  var r = diameterMm / 2;
  var areaMm2 = Math.PI * r * r;
  var volMm3 = areaMm2 * lengthMm;
  var volCm3 = volMm3 / 1000;
  return volCm3 * density;
}

function parseGcode(text, density){
  var result = {weightG:null, minutes:null, source:null};

  var wMatch = /filament used \[g\]\s*=\s*([\d.,\s]+)/i.exec(text);
  if(wMatch){
    var parts = wMatch[1].split(",").map(function(x){ return parseFloat(x.trim()); }).filter(function(x){ return !isNaN(x); });
    if(parts.length){
      result.weightG = parts.reduce(function(a,b){ return a+b; }, 0);
      result.source = "prusa-family";
    }
  }
  var tMatch = /estimated printing time \(normal mode\)\s*=\s*([^\n\r]+)/i.exec(text) ||
               /estimated printing time\s*=\s*([^\n\r]+)/i.exec(text);
  if(tMatch){
    var mins = parseDurationToMinutes(tMatch[1]);
    if(mins !== null){ result.minutes = mins; result.source = result.source || "prusa-family"; }
  }

  if(result.weightG === null){
    var curaW = /;Filament weight\s*=\s*([\d.]+)/i.exec(text);
    if(curaW){ result.weightG = parseFloat(curaW[1]); result.source = "cura"; }
    else {
      var curaLenAll = text.match(/;Filament used:\s*([\d.]+)m/ig);
      if(curaLenAll && curaLenAll.length){
        var totalLen = 0;
        curaLenAll.forEach(function(line){
          var mm = /([\d.]+)m/i.exec(line);
          if(mm) totalLen += parseFloat(mm[1]) * 1000;
        });
        if(totalLen > 0){
          result.weightG = lengthToGrams(totalLen, 1.75, density);
          result.source = "cura";
        }
      }
    }
  }
  if(result.minutes === null){
    var curaTime = /;TIME:\s*(\d+)/i.exec(text) || /;PRINT\.TIME:\s*(\d+)/i.exec(text);
    if(curaTime){ result.minutes = Math.round(parseInt(curaTime[1],10) / 60); result.source = result.source || "cura"; }
  }

  if(result.weightG === null){
    var s3dW = /;\s*filament weight\s*[:=]\s*([\d.]+)\s*g/i.exec(text);
    if(s3dW){ result.weightG = parseFloat(s3dW[1]); result.source = "simplify3d"; }
    else{
      var s3dLen = /;\s*filament length\s*[:=]\s*([\d.]+)\s*mm/i.exec(text);
      if(s3dLen){ result.weightG = lengthToGrams(parseFloat(s3dLen[1]), 1.75, density); result.source = "simplify3d"; }
    }
  }
  if(result.minutes === null){
    var s3dTime = /;\s*build time\s*[:=]\s*([^\n\r]+)/i.exec(text);
    if(s3dTime){
      var m2 = parseDurationToMinutes(s3dTime[1]);
      if(m2 !== null){ result.minutes = m2; result.source = result.source || "simplify3d"; }
    }
  }

  return result;
}

/* ---------------- state ---------------- */
var currency = "TRY";
var mode = "fdm";
var lastParsed = {weightG:null, minutes:null};
var quoteCounter = 1;

/* ---------------- wiring: locale controls ---------------- */
function wireSeg(segId, attr, onPick){
  var seg = $(segId);
  seg.querySelectorAll("button").forEach(function(btn){
    btn.addEventListener("click", function(){
      seg.querySelectorAll("button").forEach(function(b){ b.classList.remove("active"); });
      btn.classList.add("active");
      onPick(btn.getAttribute(attr));
    });
  });
}
wireSeg("langSeg", "data-lang", function(v){ lang = v; applyI18n(); populateSelects(); saveProfile(); });
wireSeg("curSeg", "data-cur", function(v){ currency = v; updateUnitsLabels(); render(); saveProfile(); });

function updateUnitsLabels(){
  var sym = CUR_SYMBOL[currency];
  $("filPriceUnit").textContent = sym + "/kg";
  $("resinPriceUnit").textContent = sym + "/L";
  $("consUnit").textContent = sym;
  $("postUnit").textContent = sym;
  $("laborUnit").textContent = sym + (lang==="tr" ? "/sa" : "/hr");
  $("printerCostUnit").textContent = sym;
  $("elecUnit").textContent = sym + "/kWh";
  $("fxUnit").textContent = currency + "/₺";
  var fxWrap = $("fxRate").parentElement.parentElement;
  fxWrap.style.display = currency === "TRY" ? "none" : "block";
}

/* ---------------- mode tabs ---------------- */
document.querySelectorAll(".modetabs button").forEach(function(btn){
  btn.addEventListener("click", function(){
    document.querySelectorAll(".modetabs button").forEach(function(b){ b.classList.remove("active"); });
    btn.classList.add("active");
    mode = btn.getAttribute("data-mode");
    $("fdmFields").hidden = mode !== "fdm";
    $("resinFields").hidden = mode !== "resin";
    render();
  });
});

/* ---------------- material / printer selection ---------------- */
$("material").addEventListener("change", function(){
  var m = MATERIALS.find(function(x){ return x.id === $("material").value; });
  if(m){
    $("density").value = m.density;
    if(!$("filPrice").dataset.touched) $("filPrice").value = m.price;
  }
  render();
});
$("printer").addEventListener("change", function(){
  var opt = $("printer").selectedOptions[0];
  if(opt && opt.dataset.w) $("watt").value = opt.dataset.w;
  render();
});
if($("resinMaterial")){
  $("resinMaterial").addEventListener("change", function(){
    var m = RESIN_MATERIALS.find(function(x){ return x.id === $("resinMaterial").value; });
    if(m && !$("resinPrice").dataset.touched) $("resinPrice").value = m.price;
    render();
  });
}
if($("resinPrinter")){
  $("resinPrinter").addEventListener("change", function(){
    var opt = $("resinPrinter").selectedOptions[0];
    if(opt && opt.dataset.w) $("resinWatt").value = opt.dataset.w;
    render();
  });
}
["filPrice","watt","resinWatt","resinPrice","materialBrand"].forEach(function(id){
  var el = $(id);
  if(!el) return;
  el.addEventListener("input", function(){ el.dataset.touched = "1"; render(); scheduleSave(); });
});

/* ---------------- dropzone ---------------- */
var dz = $("dropzone");
var fileInput = $("fileInput");
dz.addEventListener("click", function(){ fileInput.click(); });
["dragover","dragenter"].forEach(function(evt){
  dz.addEventListener(evt, function(e){ e.preventDefault(); dz.classList.add("hover"); });
});
["dragleave","drop"].forEach(function(evt){
  dz.addEventListener(evt, function(e){ e.preventDefault(); dz.classList.remove("hover"); });
});
dz.addEventListener("drop", function(e){
  var f = e.dataTransfer.files && e.dataTransfer.files[0];
  if(f) handleFile(f);
});
fileInput.addEventListener("change", function(){
  if(fileInput.files && fileInput.files[0]) handleFile(fileInput.files[0]);
});

function handleFile(file){
  var reader = new FileReader();
  reader.onload = function(){
    var text = String(reader.result || "");
    var density = num("density") || 1.24;
    var res = parseGcode(text, density);
    lastParsed = res;
    renderParseResult(res, file.name);
    if(res.weightG !== null){
      $("weight").value = Math.round(res.weightG * 10) / 10;
      $("weightAutoHint").innerHTML = '<span class="auto-pill">'+t("auto")+'</span>';
    }
    if(res.minutes !== null){
      $("hours").value = Math.floor(res.minutes / 60);
      $("minutes").value = res.minutes % 60;
      $("timeAutoHint").innerHTML = '<span class="auto-pill">'+t("auto")+'</span>';
    }
    render();
  };
  reader.onerror = function(){
    renderParseResult({weightG:null, minutes:null, source:null}, file.name, true);
  };
  reader.readAsText(file);
}

function renderParseResult(res, filename, errored){
  var box = $("parseResult");
  box.innerHTML = "";
  var div = document.createElement("div");
  if(errored || (res.weightG === null && res.minutes === null)){
    div.className = "parsebox bad";
    div.innerHTML = "⚠️ " + t("parsedNone");
  } else if(res.weightG !== null && res.minutes !== null){
    div.className = "parsebox ok";
    div.innerHTML = "✅ <b>"+filename+"</b> — " + t("parsedBoth") + " " +
      fmt(res.weightG,1) + " g, " + Math.floor(res.minutes/60) + "s " + (res.minutes%60) + "dk";
  } else {
    div.className = "parsebox bad";
    div.innerHTML = "⚠️ <b>"+filename+"</b> — " + t("parsedPartial") + " " +
      (res.weightG !== null ? fmt(res.weightG,1)+" g" : "—") + " / " +
      (res.minutes !== null ? Math.floor(res.minutes/60)+"s "+(res.minutes%60)+"dk" : "—");
  }
  box.appendChild(div);
}

/* ---------------- depreciation toggle ---------------- */
$("depToggle").addEventListener("change", function(){
  $("depFields").hidden = !$("depToggle").checked;
  render();
});

/* ---------------- live recalculation ---------------- */
var allInputs = ["weight","density","filPrice","watt","resinVol","resinPrice","resinWatt","resinConsumables",
  "hours","minutes","elecPrice","failRate","postProcess","laborRate","laborTime","printerCost","lifetimeHours","margin","fxRate"];
allInputs.forEach(function(id){
  $(id).addEventListener("input", function(){ render(); scheduleSave(); });
});
var saveTimer;
function scheduleSave(){ clearTimeout(saveTimer); saveTimer = setTimeout(saveProfile, 900); }

function fx(amountTRY){
  if(currency === "TRY") return {value: amountTRY, ok:true};
  var rate = num("fxRate");
  if(!rate) return {value: amountTRY, ok:false};
  return {value: amountTRY * rate, ok:true};
}

function render(){
  var lines = $("lines");
  lines.innerHTML = "";
  var warnBox = $("warnBox");
  warnBox.innerHTML = "";

  var materialCostTRY = 0, elecCostTRY = 0, consumablesTRY = 0;
  var badgeHtml = "";

  if(mode === "fdm"){
    var weight = num("weight");
    var density = num("density") || 1.24;
    var pricePerKg = num("filPrice");
    materialCostTRY = (weight/1000) * pricePerKg;
    badgeHtml = '<span class="badge">'+fmt(weight,1)+' g</span><span class="badge">'+fmt(density,2)+' g/cm³</span>';
  } else {
    var vol = num("resinVol");
    var pricePerL = num("resinPrice");
    materialCostTRY = (vol/1000) * pricePerL;
    consumablesTRY = num("resinConsumables");
    badgeHtml = '<span class="badge">'+fmt(vol,0)+' ml</span>';
  }

  var totalMinutes = num("hours")*60 + num("minutes");
  var totalHours = totalMinutes / 60;
  var watt = mode === "fdm" ? num("watt") : num("resinWatt");
  var elecPriceKwh = num("elecPrice");
  var kwh = (watt/1000) * totalHours;
  elecCostTRY = kwh * elecPriceKwh;
  badgeHtml += '<span class="badge">'+Math.floor(totalMinutes/60)+'sa '+(totalMinutes%60)+'dk</span><span class="badge">'+fmt(watt,0)+'W</span>';
  var curColor = COLORS.find(function(c){ return c.id === selectedColor; });
  if(curColor){
    badgeHtml += '<span class="badge"><span class="badge-swatch" style="background:'+curColor.hex+'"></span>'+(lang==="tr"?curColor.tr:curColor.en)+'</span>';
  }
  var brandVal = $("materialBrand") ? $("materialBrand").value.trim() : "";
  if(brandVal){
    badgeHtml += '<span class="badge">'+brandVal+'</span>';
  }
  $("modeBadge").innerHTML = badgeHtml;

  var baseCostTRY = materialCostTRY + elecCostTRY + consumablesTRY;

  var failRate = num("failRate") / 100;
  var failCostTRY = baseCostTRY * failRate;

  var postTRY = num("postProcess");
  var laborTRY = (num("laborRate")) * (num("laborTime")/60);
  var postTotalTRY = postTRY + laborTRY;

  var depTRY = 0;
  if($("depToggle").checked){
    var printerCost = num("printerCost");
    var lifetime = num("lifetimeHours") || 1;
    depTRY = (printerCost / lifetime) * totalHours;
  }

  var subtotalTRY = baseCostTRY + failCostTRY + postTotalTRY + depTRY;
  var marginPct = num("margin") / 100;
  var marginTRY = subtotalTRY * marginPct;
  var totalTRY = subtotalTRY + marginTRY;

  function addLine(labelKey, amountTRY, opts){
    opts = opts || {};
    var row = document.createElement("div");
    row.className = "line" + (opts.sum ? " sum" : "") + (opts.sub ? " sub" : "");
    var conv = fx(amountTRY);
    var sym = CUR_SYMBOL[currency];
    row.innerHTML = '<span class="l">'+t(labelKey)+'</span><span class="r mono">'+sym+' '+fmt(conv.value, opts.dec===0?0:2)+'</span>';
    lines.appendChild(row);
    return conv.ok;
  }

  var fxOk = true;
  fxOk = addLine("rowMaterial", materialCostTRY) && fxOk;
  fxOk = addLine("rowElec", elecCostTRY) && fxOk;
  fxOk = addLine("rowFail", failCostTRY) && fxOk;
  if(postTotalTRY > 0) fxOk = addLine("rowPost", postTotalTRY) && fxOk;
  if(depTRY > 0) fxOk = addLine("rowDep", depTRY) && fxOk;
  fxOk = addLine("rowSubtotal", subtotalTRY, {sub:true}) && fxOk;
  fxOk = addLine("rowMargin", marginTRY, {sub:true}) && fxOk;
  fxOk = addLine("rowTotal", totalTRY, {sum:true}) && fxOk;

  if(!fxOk){
    var w = document.createElement("div");
    w.className = "warnline";
    w.textContent = "⚠ " + t("fxMissing");
    warnBox.appendChild(w);
  }

  $("ticketTag").textContent = (mode === "fdm" ? "FDM" : "RESIN") + " · " + new Date().toLocaleDateString(t("dateLocale"));

  window.__lastCalc = {
    materialCostTRY:materialCostTRY, elecCostTRY:elecCostTRY, failCostTRY:failCostTRY,
    postTotalTRY:postTotalTRY, depTRY:depTRY, subtotalTRY:subtotalTRY, marginTRY:marginTRY, totalTRY:totalTRY
  };
  updateQuoteIfOpen();
}

/* ---------------- quote section ---------------- */
$("quoteBtn").addEventListener("click", function(){
  var sec = $("quoteSection");
  sec.hidden = !sec.hidden;
  if(!sec.hidden){
    if(!$("bizName").value) $("bizName").value = "Umt3D Studio";
    updateQuoteIfOpen();
    sec.scrollIntoView({behavior:"smooth", block:"nearest"});
  }
});
["bizName","custName","partName"].forEach(function(id){
  $(id).addEventListener("input", updateQuoteIfOpen);
});

function updateQuoteIfOpen(){
  if($("quoteSection").hidden) return;
  var calc = window.__lastCalc;
  if(!calc) return;
  var sym = CUR_SYMBOL[currency];
  $("qBiz").textContent = $("bizName").value || "Umt3D Studio";
  $("qCust").textContent = ($("custName").value || "—") ;
  $("qPart").textContent = $("partName").value || (lang==="tr" ? "İsimsiz proje" : "Untitled project");
  $("qDate").textContent = new Date().toLocaleDateString(t("dateLocale"));
  $("qNo").textContent = "#" + new Date().getFullYear() + "-" + String(quoteCounter).padStart(3,"0");

  var rows = $("qRows");
  rows.innerHTML = "";
  function row(label, amountTRY, isTotal){
    var conv = fx(amountTRY);
    var r = document.createElement("div");
    r.className = "quote-row" + (isTotal ? " tot" : "");
    r.innerHTML = "<span>"+label+"</span><span class=\"mono\">"+sym+" "+fmt(conv.value,2)+"</span>";
    rows.appendChild(r);
  }
  row(t("rowSubtotal"), calc.subtotalTRY);
  row(t("rowMargin"), calc.marginTRY);
  row(t("rowTotal"), calc.totalTRY, true);
}

$("copyBtn").addEventListener("click", function(){
  var calc = window.__lastCalc;
  if(!calc) return;
  var sym = CUR_SYMBOL[currency];
  var biz = $("bizName").value || "Umt3D Studio";
  var cust = $("custName").value || "—";
  var part = $("partName").value || (lang==="tr" ? "İsimsiz proje" : "Untitled project");
  var dateStr = new Date().toLocaleDateString(t("dateLocale"));
  var no = "#" + new Date().getFullYear() + "-" + String(quoteCounter).padStart(3,"0");
  var lines = [
    biz,
    (lang==="tr"?"Müşteri: ":"Customer: ") + cust,
    (lang==="tr"?"Proje: ":"Project: ") + part,
    dateStr + "  " + no,
    "---------------------------",
    t("rowSubtotal") + ": " + sym + " " + fmt(fx(calc.subtotalTRY).value,2),
    t("rowMargin") + ": " + sym + " " + fmt(fx(calc.marginTRY).value,2),
    t("rowTotal") + ": " + sym + " " + fmt(fx(calc.totalTRY).value,2)
  ];
  var curColor = COLORS.find(function(c){ return c.id === selectedColor; });
  var brandVal = $("materialBrand") ? $("materialBrand").value.trim() : "";
  var specLine = (curColor ? (lang==="tr"?"Renk: ":"Color: ") + (lang==="tr"?curColor.tr:curColor.en) : "") +
    (brandVal ? "  ·  " + (lang==="tr"?"Marka: ":"Brand: ") + brandVal : "");
  if(specLine) lines.splice(4, 0, specLine);
  var text = lines.join("\n");
  function done(){
    var btn = $("copyBtn");
    var orig = btn.textContent;
    btn.textContent = "✓ " + t("quoteCopied");
    setTimeout(function(){ btn.textContent = orig; }, 1800);
  }
  if(navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(text).then(function(){ done(); quoteCounter++; }).catch(function(){
      fallbackCopy(text); done(); quoteCounter++;
    });
  } else {
    fallbackCopy(text); done(); quoteCounter++;
  }
});
function fallbackCopy(text){
  try{
    var ta = document.createElement("textarea");
    ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.focus(); ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
  }catch(e){ /* ignore */ }
}

/* ---------------- init ---------------- */
function init(){
  populateSelects();
  $("material").value = "pla";
  $("material").dispatchEvent(new Event("change"));
  $("printer").value = "ender3v2";
  $("printer").dispatchEvent(new Event("change"));

  $("weight").value = 42;
  $("hours").value = 3;
  $("minutes").value = 15;
  $("elecPrice").value = "";
  $("resinVol").value = 65;
  $("resinPrice").value = 1800;

  var saved = loadProfile();
  if(saved){
    try{
      lang = saved.lang || "tr";
      currency = saved.currency || "TRY";
      if(saved.elecPrice) $("elecPrice").value = saved.elecPrice;
      if(saved.filPrice){ $("filPrice").value = saved.filPrice; $("filPrice").dataset.touched = "1"; }
      if(saved.failRate !== undefined) $("failRate").value = saved.failRate;
      if(saved.postProcess !== undefined) $("postProcess").value = saved.postProcess;
      if(saved.laborRate !== undefined) $("laborRate").value = saved.laborRate;
      if(saved.margin !== undefined) $("margin").value = saved.margin;
      if(saved.depToggle){ $("depToggle").checked = true; $("depFields").hidden = false; }
      if(saved.printerCost) $("printerCost").value = saved.printerCost;
      if(saved.lifetimeHours) $("lifetimeHours").value = saved.lifetimeHours;
      if(saved.fxRate) $("fxRate").value = saved.fxRate;
      if(saved.bizName && $("bizName")) $("bizName").value = saved.bizName;
      if(saved.resinPrice) $("resinPrice").value = saved.resinPrice;
      if(saved.material){ $("material").value = saved.material; $("material").dispatchEvent(new Event("change")); }
      if(saved.printer){ $("printer").value = saved.printer; $("printer").dispatchEvent(new Event("change")); }
      if(saved.materialBrand && $("materialBrand")){ $("materialBrand").value = saved.materialBrand; $("materialBrand").dataset.touched = "1"; }
      if(saved.color){ selectedColor = saved.color; }
      if(saved.resinMaterial && $("resinMaterial")){ $("resinMaterial").value = saved.resinMaterial; }
      if(saved.resinPrinter && $("resinPrinter")){ $("resinPrinter").value = saved.resinPrinter; $("resinPrinter").dispatchEvent(new Event("change")); }

      document.querySelectorAll("#langSeg button").forEach(function(b){ b.classList.toggle("active", b.getAttribute("data-lang")===lang); });
      document.querySelectorAll("#curSeg button").forEach(function(b){ b.classList.toggle("active", b.getAttribute("data-cur")===currency); });
    }catch(e){ /* ignore corrupt profile */ }
  }

  updateUnitsLabels();
  applyI18n();
  render();
}
init();
})();
