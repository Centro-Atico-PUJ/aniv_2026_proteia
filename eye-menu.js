/* ============================================================
   proteia — Ojo flotante (menú de navegación)
   Componente único y autónomo: inyecta sus estilos y su markup.
   Se incluye en todas las secciones con:
     <script src="eye-menu.js" defer></script>
   ============================================================ */
(function () {
  "use strict";

  var LINKS = [
    { label: "Inicio",     href: "index.html" },
    { label: "Momentos",   href: "retos.html" },
    { label: "Principios", href: "principios.html" },
    { label: "Glosario",   href: "#" },
    { label: "Podcast",    href: "#" },
    { label: "Contacto",   href: "#" }
  ];

  var EYE_SVG =
    '<svg viewBox="0 0 86 86" aria-hidden="true" focusable="false">' +
      '<path fill="#575757" d="M86 43C86 66.8 66.8 86 43 86C19.2 86 0 66.8 0 43C0 19.2 19.2 0 43 0C66.8 0 86 19.2 86 43Z"/>' +
      '<path fill="#EEEEEE" d="M43 0.2C58.6 0.2 72.3 8.5 79.8 21C72.3 33.5 58.6 41.8 43 41.8C27.3 41.8 13.7 33.5 6.1 21C13.7 8.5 27.3 0.2 43 0.2Z"/>' +
      '<path fill="#282828" d="M61 21C61 31.5 52.7 40 42.5 40C32.3 40 24 31.5 24 21C24 10.5 32.3 2 42.5 2C52.7 2 61 10.5 61 21Z"/>' +
      '<path fill="#575757" d="M49 21C49 24.3 46.3 27 43 27C39.7 27 37 24.3 37 21C37 17.7 39.7 15 43 15C46.3 15 49 17.7 49 21Z"/>' +
    '</svg>';

  var CSS = [
    ".eye-menu{position:fixed;top:clamp(12px,2.2vw,22px);left:clamp(12px,2.2vw,22px);z-index:9999;--em-morado:#5E3986;--em-crema:#EEEEEE}",
    ".eye-menu__btn{display:block;width:clamp(40px,5vw,50px);height:auto;padding:0;margin:0;border:0;background:transparent;cursor:pointer;line-height:0;border-radius:50%;-webkit-tap-highlight-color:transparent;filter:drop-shadow(0 4px 12px rgba(40,40,40,.35));transition:transform .18s ease}",
    ".eye-menu__btn svg{display:block;width:100%;height:auto}",
    ".eye-menu__btn:hover{transform:scale(1.07)}",
    ".eye-menu__btn:focus-visible{outline:2px solid #fff;outline-offset:3px}",
    ".eye-menu.is-open .eye-menu__btn{transform:scale(1.07)}",
    ".eye-menu__panel{position:absolute;top:calc(100% + 10px);left:0;min-width:186px;margin:0;padding:8px;background:var(--em-morado);color:var(--em-crema);border-radius:16px;box-shadow:0 12px 34px rgba(40,40,40,.38);animation:eyeMenuIn .16s ease}",
    ".eye-menu__panel::before{content:\"\";position:absolute;left:0;right:0;top:-14px;height:14px}",
    ".eye-menu__panel[hidden]{display:none}",
    ".eye-menu__panel ul{list-style:none;margin:0;padding:0}",
    ".eye-menu__panel li{margin:0}",
    ".eye-menu__panel a{display:block;padding:10px 14px;border-radius:10px;font-family:'Podkova','Bitter',Georgia,'Times New Roman',serif;font-size:16px;line-height:1.1;color:var(--em-crema);text-decoration:none;white-space:nowrap}",
    ".eye-menu__panel a:hover{background:rgba(255,255,255,.12)}",
    ".eye-menu__panel a:focus-visible{outline:2px solid var(--em-crema);outline-offset:-2px}",
    ".eye-menu__panel a[aria-current=\"page\"]{background:rgba(255,255,255,.18);font-weight:700}",
    "@keyframes eyeMenuIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:none}}",
    "@media (prefers-reduced-motion:reduce){.eye-menu__panel{animation:none}.eye-menu__btn{transition:none}}"
  ].join("");

  // Sub-páginas que deben resaltar otra entrada del menú.
  var ALIAS = { "principios-historia.html": "principios.html" };

  function currentFile() {
    var name = (window.location.pathname.split("/").pop() || "").toLowerCase();
    if (name === "") name = "index.html";
    return ALIAS[name] || name;
  }

  function build() {
    if (document.querySelector(".eye-menu")) return;

    var style = document.createElement("style");
    style.textContent = CSS;
    document.head.appendChild(style);

    var here = currentFile();

    var items = LINKS.map(function (l) {
      var current = l.href.toLowerCase() === here ? ' aria-current="page"' : "";
      return "<li><a href=\"" + l.href + "\"" + current + ">" + l.label + "</a></li>";
    }).join("");

    var wrap = document.createElement("div");
    wrap.className = "eye-menu";
    wrap.innerHTML =
      '<button class="eye-menu__btn" type="button" aria-label="Abrir menú de navegación" aria-expanded="false" aria-controls="eyeMenuPanel">' +
        EYE_SVG +
      "</button>" +
      '<nav class="eye-menu__panel" id="eyeMenuPanel" aria-label="Menú principal" hidden><ul>' + items + "</ul></nav>";

    document.body.appendChild(wrap);

    var btn = wrap.querySelector(".eye-menu__btn");
    var panel = wrap.querySelector(".eye-menu__panel");

    function open() {
      panel.hidden = false;
      wrap.classList.add("is-open");
      btn.setAttribute("aria-expanded", "true");
      btn.setAttribute("aria-label", "Cerrar menú de navegación");
      document.addEventListener("click", onDocClick, true);
      document.addEventListener("keydown", onKey);
    }
    function close() {
      panel.hidden = true;
      wrap.classList.remove("is-open");
      btn.setAttribute("aria-expanded", "false");
      btn.setAttribute("aria-label", "Abrir menú de navegación");
      document.removeEventListener("click", onDocClick, true);
      document.removeEventListener("keydown", onKey);
    }
    function onDocClick(e) {
      if (!wrap.contains(e.target)) close();
    }
    function onKey(e) {
      if (e.key === "Escape" || e.key === "Esc") {
        close();
        btn.focus();
      }
    }

    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      if (panel.hidden) open(); else close();
    });

    // Abrir al pasar el mouse (en dispositivos con puntero).
    var leaveTimer = null;
    var canHover = window.matchMedia && window.matchMedia("(hover: hover)").matches;
    if (canHover) {
      wrap.addEventListener("mouseenter", function () {
        if (leaveTimer) { clearTimeout(leaveTimer); leaveTimer = null; }
        open();
      });
      wrap.addEventListener("mouseleave", function () {
        if (leaveTimer) clearTimeout(leaveTimer);
        leaveTimer = setTimeout(function () { leaveTimer = null; close(); }, 180);
      });
    }

    // Al elegir un destino real, deja que el navegador cambie de página.
    panel.addEventListener("click", function (e) {
      var a = e.target.closest("a");
      if (a && a.getAttribute("href") === "#") {
        e.preventDefault();
        close();
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", build);
  } else {
    build();
  }
})();
