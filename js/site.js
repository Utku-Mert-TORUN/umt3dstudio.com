/* Umt3D Studio — shared site behavior: mobile nav + persisted theme toggle */
(function(){
  "use strict";

  var THEME_KEY = "umt3d_theme";

  function getSavedTheme(){
    try{ return localStorage.getItem(THEME_KEY) || "auto"; }
    catch(e){ return "auto"; }
  }
  function saveTheme(v){
    try{ localStorage.setItem(THEME_KEY, v); }catch(e){ /* ignore */ }
  }
  function applyTheme(v){
    if(v === "auto") document.documentElement.removeAttribute("data-theme");
    else document.documentElement.setAttribute("data-theme", v);
    document.querySelectorAll(".theme-toggle button").forEach(function(btn){
      btn.classList.toggle("active", btn.getAttribute("data-theme") === v);
    });
  }

  function initTheme(){
    var saved = getSavedTheme();
    applyTheme(saved);
    document.querySelectorAll(".theme-toggle button").forEach(function(btn){
      btn.addEventListener("click", function(){
        var v = btn.getAttribute("data-theme");
        saveTheme(v);
        var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        /* View Transitions destekleyen tarayıcılarda tema değişimi yumuşak geçer */
        if(document.startViewTransition && !reduce){
          try{
            document.startViewTransition(function(){ applyTheme(v); });
            return;
          }catch(e){ /* düşerse normal değişime geç */ }
        }
        applyTheme(v);
      });
    });
  }

  function initNav(){
    var burger = document.querySelector(".nav-burger");
    var links = document.querySelector(".nav-links");
    if(!burger || !links) return;
    burger.addEventListener("click", function(){
      links.classList.toggle("open");
      burger.setAttribute("aria-expanded", links.classList.contains("open") ? "true" : "false");
    });
    links.querySelectorAll("a").forEach(function(a){
      a.addEventListener("click", function(){ links.classList.remove("open"); });
    });
  }

  function initReveal(){
    var items = document.querySelectorAll(".reveal");
    if(!items.length) return;
    if(!("IntersectionObserver" in window)){
      items.forEach(function(el){ el.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){ entry.target.classList.add("in"); io.unobserve(entry.target); }
      });
    }, {threshold:.12});
    items.forEach(function(el){ io.observe(el); });
  }

  /* Aktif menü: temiz adresler (/calculator) ve .html'li adresler (/calculator.html) aynı sayılır */
  function pageKey(p){
    var name = (p || "").split("/").filter(Boolean).pop() || "index";
    name = name.replace(/\.html?$/i, "");
    return name === "" ? "index" : name;
  }
  function markActiveNav(){
    var current = pageKey(location.pathname);
    document.querySelectorAll(".nav-links a").forEach(function(a){
      var href = a.getAttribute("href") || "";
      if(/^https?:/i.test(href)) return;
      if(pageKey(href) === current){
        a.classList.add("active");
        a.setAttribute("aria-current", "page");
      }
    });
  }

  /* Service worker: yalnızca https veya localhost'ta (çevrimdışı kullanım için) */
  function initPWA(){
    if(!("serviceWorker" in navigator)) return;
    var ok = location.protocol === "https:" || location.hostname === "localhost" || location.hostname === "127.0.0.1";
    if(!ok) return;
    window.addEventListener("load", function(){
      navigator.serviceWorker.register("sw.js").catch(function(){ /* sessizce geç */ });
    });
  }

  /* Kartların üzerinde imleci takip eden ışık (dokunmatik cihazlarda kapalı) */
  function initSpotlight(){
    if(window.matchMedia && window.matchMedia("(hover: none)").matches) return;
    document.querySelectorAll(".feature-card, .step").forEach(function(el){
      var raf = null, last = null;
      el.addEventListener("pointermove", function(e){
        last = e;
        if(raf) return;
        raf = requestAnimationFrame(function(){
          raf = null;
          var r = el.getBoundingClientRect();
          el.style.setProperty("--mx", (last.clientX - r.left) + "px");
          el.style.setProperty("--my", (last.clientY - r.top) + "px");
        });
      }, {passive:true});
    });
  }

  /* Canlı örnek: kaydırıcılarla anlık fiyat. Örnek teklif kartı da aynı hesapla güncellenir. */
  function initLiveDemo(){
    var g = document.getElementById("demoGrams");
    if(!g) return;
    var h = document.getElementById("demoHours");
    var outG = document.getElementById("demoGramsOut");
    var outH = document.getElementById("demoHoursOut");
    var tot = document.getElementById("demoTotal");
    var brk = document.getElementById("demoBreak");
    var sqCost = document.getElementById("sqCost");
    var sqMargin = document.getElementById("sqMargin");
    var sqTotal = document.getElementById("sqTotal");
    var PRICE_KG = 650, KWH = 4.5, WATT = 0.21, MARGIN = 0.35;
    var shown = null, raf = null;
    function fmtTL(v){ return "₺ " + v.toLocaleString("tr-TR", {minimumFractionDigits:2, maximumFractionDigits:2}); }
    function setTotal(v){
      tot.textContent = fmtTL(v);
      if(sqTotal) sqTotal.textContent = fmtTL(v);
    }
    function tween(to){
      /* İlk hesapta animasyon yok: değer doğrudan yazılır */
      if(shown === null || (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches)){
        shown = to; setTotal(to); return;
      }
      var from = shown, start = performance.now(), dur = 380;
      if(raf) cancelAnimationFrame(raf);
      function step(now){
        var p = Math.min(1, (now - start) / dur), e = 1 - Math.pow(1 - p, 3);
        shown = from + (to - from) * e;
        setTotal(shown);
        if(p < 1) raf = requestAnimationFrame(step);
        else { shown = to; setTotal(to); }
      }
      raf = requestAnimationFrame(step);
    }
    function upd(){
      var grams = +g.value, hrs = +h.value;
      var mat = grams / 1000 * PRICE_KG;
      var elec = WATT * hrs * KWH;
      var cost = mat + elec;
      var total = cost * (1 + MARGIN);
      var H = Math.floor(hrs), M = Math.round((hrs - H) * 60);
      outG.textContent = grams + " g";
      outH.textContent = H + " sa " + M + " dk";
      brk.textContent = "Malzeme ₺" + mat.toFixed(0) + " · Elektrik ₺" + elec.toFixed(0);
      if(sqCost) sqCost.textContent = fmtTL(cost);
      if(sqMargin) sqMargin.textContent = fmtTL(total - cost);
      tween(total);
    }
    g.addEventListener("input", upd);
    h.addEventListener("input", upd);
    upd();
  }

  /* Galeri: window.GALLERY dizisi doluysa gösterilir */
  function initGallery(){
    var sec = document.getElementById("galeri");
    var box = document.getElementById("gallery");
    var items = window.GALLERY || [];
    if(!sec || !box || !items.length) return;
    sec.hidden = false;
    items.forEach(function(it){
      var fig = document.createElement("figure");
      fig.className = "gal-item";
      var img = document.createElement("img");
      img.loading = "lazy"; img.decoding = "async";
      img.src = it.src; img.alt = it.alt || "";
      fig.appendChild(img);
      if(it.caption){
        var cap = document.createElement("figcaption");
        cap.textContent = it.caption;
        fig.appendChild(cap);
      }
      box.appendChild(fig);
    });
  }

  /* Ana ekrana ekleme ipucu (yalnızca mobilde, bir kez kapatılabilir) */
  function initInstallHint(){
    var KEY = "umt3d_install_hint_v1";
    try{ if(localStorage.getItem(KEY)) return; }catch(e){ /* ignore */ }
    var standalone = (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) || window.navigator.standalone;
    if(standalone || !(window.matchMedia && window.matchMedia("(max-width: 760px)").matches)) return;
    var bar = document.createElement("div");
    bar.className = "install-hint";
    bar.setAttribute("role", "status");
    bar.innerHTML = '<div><strong>Ana ekrana ekle</strong><span>Tarayıcı menüsünden “Ana ekrana ekle” seçeneğiyle uygulama gibi aç.</span></div><button type="button" aria-label="Kapat">✕</button>';
    bar.querySelector("button").addEventListener("click", function(){
      bar.remove();
      try{ localStorage.setItem(KEY, "1"); }catch(e){ /* ignore */ }
    });
    document.body.appendChild(bar);
  }

  /* Rakamlar görünür olunca sayarak gelir */
  function initCountUp(){
    var els = document.querySelectorAll(".hero-stats .num");
    if(!els.length || !("IntersectionObserver" in window)) return;
    if(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(!en.isIntersecting) return;
        io.unobserve(en.target);
        animateNum(en.target);
      });
    }, {threshold:.6});
    els.forEach(function(el){ io.observe(el); });
  }
  function animateNum(el){
    var m = el.textContent.match(/^(\d+)(.*)$/);
    if(!m) return;
    var end = parseInt(m[1], 10), suffix = m[2], start = performance.now(), dur = 900;
    el.textContent = "0" + suffix;
    function step(now){
      var p = Math.min(1, (now - start) / dur), e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(end * e) + suffix;
      if(p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* Çerezsiz ölçüm (Cloudflare Web Analytics). Yalnızca window.UMT_ANALYTICS_TOKEN doluysa yüklenir. */
  function initAnalytics(){
    var token = window.UMT_ANALYTICS_TOKEN;
    if(!token || typeof token !== "string") return;
    var sc = document.createElement("script");
    sc.defer = true;
    sc.src = "https://static.cloudflareinsights.com/beacon.min.js";
    sc.setAttribute("data-cf-beacon", JSON.stringify({token: token}));
    document.head.appendChild(sc);
  }

  /* Klavye kullanıcıları için: sayfa içeriğine geç bağlantısı odağı doğru yere taşır */
  function initSkipLink(){
    var main = document.querySelector("main");
    var link = document.querySelector(".skip-link");
    if(!main || !link) return;
    if(!main.id) main.id = "main";
    main.setAttribute("tabindex", "-1");
  }

  /* Ana sayfa: adım akışında görünen adıma göre sabit görsel değişir */
  function initFlow(){
    var steps = document.querySelectorAll(".flow-step");
    var figs = document.querySelectorAll(".flow-visual figure");
    if(!steps.length || !figs.length) return;
    function activate(n){
      steps.forEach(function(s){ s.classList.toggle("is-on", s.getAttribute("data-s") === n); });
      figs.forEach(function(f){ f.classList.toggle("is-on", f.getAttribute("data-s") === n); });
    }
    if(!("IntersectionObserver" in window)) return;
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(en.isIntersecting) activate(en.target.getAttribute("data-s"));
      });
    }, {rootMargin:"-40% 0px -40% 0px", threshold:0});
    steps.forEach(function(s){ io.observe(s); });
  }

  document.addEventListener("DOMContentLoaded", function(){
    initAnalytics();
    initSkipLink();
    initLiveDemo();
    initGallery();
    initInstallHint();
    initCountUp();
    initSpotlight();
    initFlow();
    initPWA();
    initTheme();
    initNav();
    initReveal();
    markActiveNav();
    /* Trigger page-load entrance animations defined in site.css */
    requestAnimationFrame(function(){
      requestAnimationFrame(function(){
        document.body.classList.add("loaded");
      });
    });
  });
})();
