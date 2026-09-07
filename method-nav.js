/* ============================================================
   proteia — Navegación circular entre los tres momentos del método
   (Visualización · Evaluación · Adaptación).
   Componente único y autónomo: inyecta dos botones flotantes fijos
   a la pantalla (como el ojo), asi que siguen viéndose aunque se
   deslice el carril horizontal hacia "Herramientas". Se incluye
   SOLO en esas tres páginas con:
     <script src="method-nav.js" defer></script>
   ============================================================ */
(function () {
  "use strict";

  // Orden del ciclo. Cada página enlaza con la anterior y la
  // siguiente de esta lista, dando la vuelta en los extremos.
  var SEQUENCE = [
    { href: "visualizacion.html", label: "Visualización" },
    { href: "evaluacion.html",    label: "Evaluación" },
    { href: "adaptacion.html",    label: "Adaptación" }
  ];

  var CSS = [
    ".method-nav{position:fixed;left:clamp(16px,3.6vw,56px);bottom:calc(var(--nav-h, 70px) + clamp(14px,2vh,26px));z-index:500;display:flex;flex-wrap:wrap;align-items:center;gap:clamp(10px,1.6vw,20px);pointer-events:none}",
    ".method-nav a{pointer-events:auto;display:inline-flex;align-items:center;gap:.45em;padding:.75em 1.5em;border-radius:999px;background:rgba(40,40,40,.42);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);border:1.5px solid rgba(238,238,238,.6);color:#EEEEEE;text-decoration:none;font-family:'Jauria','Podkova','Bitter',Georgia,'Times New Roman',serif;font-weight:400;font-size:clamp(13px,1.3vw,16px);line-height:1;white-space:nowrap;box-shadow:0 6px 18px rgba(40,40,40,.3);transition:background .2s ease,transform .2s ease}",
    ".method-nav a:hover,.method-nav a:focus-visible{background:rgba(40,40,40,.68);transform:translateY(-2px)}",
    ".method-nav a:focus-visible{outline:2px solid #EEEEEE;outline-offset:2px}",
    ".method-nav__arrow{font-size:1.1em;line-height:1}",
    /* En movil el carril horizontal se desactiva (los paneles se apilan
       verticalmente), asi que "deslizar a la derecha" no aplica: se
       ancla arriba a la derecha en vez de pelear con el alto variable
       del pie de pagina, que ahi se apila en varias lineas. */
    "@media (max-width:680px){.method-nav{left:auto;right:12px;top:clamp(64px,15vw,86px);bottom:auto;flex-direction:column;align-items:flex-end;gap:8px}.method-nav a{font-size:13px;padding:.65em 1.2em}}"
  ].join("");

  function currentFile() {
    return (window.location.pathname.split("/").pop() || "").toLowerCase();
  }

  function build() {
    if (document.querySelector(".method-nav")) return;

    var here = currentFile();
    var idx = -1;
    for (var i = 0; i < SEQUENCE.length; i++) {
      if (SEQUENCE[i].href.toLowerCase() === here) { idx = i; break; }
    }
    if (idx === -1) return; // esta página no forma parte del ciclo

    var prev = SEQUENCE[(idx - 1 + SEQUENCE.length) % SEQUENCE.length];
    var next = SEQUENCE[(idx + 1) % SEQUENCE.length];

    var style = document.createElement("style");
    style.textContent = CSS;
    document.head.appendChild(style);

    var nav = document.createElement("div");
    nav.className = "method-nav";
    nav.innerHTML =
      '<a href="' + prev.href + '" aria-label="Sección anterior: ' + prev.label + '">' +
        '<span class="method-nav__arrow" aria-hidden="true">&larr;</span>' + prev.label +
      "</a>" +
      '<a href="' + next.href + '" aria-label="Siguiente sección: ' + next.label + '">' +
        next.label + '<span class="method-nav__arrow" aria-hidden="true">&rarr;</span>' +
      "</a>";

    document.body.appendChild(nav);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", build);
  } else {
    build();
  }
})();
