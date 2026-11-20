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

  function markActiveNav(){
    var path = location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav-links a").forEach(function(a){
      var href = a.getAttribute("href");
      if(href === path || (path === "" && href === "index.html")){
        a.classList.add("active");
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

  document.addEventListener("DOMContentLoaded", function(){
    initSpotlight();
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
