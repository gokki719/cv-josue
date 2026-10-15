/* Comportamiento del CV: modal de insignias */
document.getElementById('modalInsignia').addEventListener('show.bs.modal',function(e){
  var b=e.relatedTarget; if(!b) return;
  var im=document.getElementById('imgInsignia');
  im.src=b.getAttribute('data-img'); im.alt=b.getAttribute('data-titulo');
  document.getElementById('tituloInsignia').textContent=b.getAttribute('data-titulo');
});

/* Menú activo según la sección que está en pantalla (bajando y subiendo) */
(function () {
  var links = Array.prototype.slice.call(document.querySelectorAll('#menu .nav-link'));
  var items = links.map(function (a) {
    return { a: a, el: document.querySelector(a.getAttribute('href')) };
  }).filter(function (i) { return i.el; });
  var ocupado = false;

  function actualizar() {
    ocupado = false;
    var y = window.scrollY + 120;            // 120px: alto del menú fijo + un margen
    var actual = items[0];
    items.forEach(function (i) { if (i.el.offsetTop <= y) actual = i; });
    var alFinal = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
    if (alFinal) actual = items[items.length - 1];   // Contacto es corto: se activa al llegar al fondo
    links.forEach(function (a) { a.classList.remove('active'); a.removeAttribute('aria-current'); });
    actual.a.classList.add('active');
    actual.a.setAttribute('aria-current', 'true');
  }

  function pedir() { if (!ocupado) { ocupado = true; window.requestAnimationFrame(actualizar); } }
  window.addEventListener('scroll', pedir, { passive: true });
  window.addEventListener('resize', pedir);
  actualizar();
})();

/* Estrellas sutiles en el footer (parpadeo lento y poco movimiento) */
(function () {
  var lienzo = document.getElementById('estrellas');
  if (!lienzo || !lienzo.getContext) return;
  var pie = lienzo.parentNode, ctx = lienzo.getContext('2d');
  var estrellas = [], w = 0, h = 0, visible = false, raf = 0, antes = 0;
  var quieto = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var colores = ['255,255,255', '255,255,255', '255,255,255', '255,212,0', '255,106,0'];

  function medir() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = pie.clientWidth; h = pie.clientHeight;
    lienzo.width = w * dpr; lienzo.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var n = Math.round((w * h) / 9000);
    estrellas = [];
    for (var i = 0; i < n; i++) {
      estrellas.push({
        x: Math.random() * w, y: Math.random() * h,
        r: Math.random() * 1.1 + 0.35,
        v: Math.random() * 0.0012 + 0.0004,       // velocidad del parpadeo
        f: Math.random() * 6.283,                  // fase
        d: Math.random() * 0.006 + 0.002,          // deriva horizontal (px por ms)
        c: colores[Math.floor(Math.random() * colores.length)]
      });
    }
    pintar(performance.now(), 0);
  }

  function pintar(t, dt) {
    ctx.clearRect(0, 0, w, h);
    for (var i = 0; i < estrellas.length; i++) {
      var e = estrellas[i];
      e.x -= e.d * dt;
      if (e.x < -2) e.x = w + 2;
      var o = 0.22 + 0.55 * (0.5 + 0.5 * Math.sin(t * e.v + e.f));
      ctx.fillStyle = 'rgba(' + e.c + ',' + o.toFixed(3) + ')';
      ctx.beginPath(); ctx.arc(e.x, e.y, e.r, 0, 6.283); ctx.fill();
    }
  }

  function paso(t) {
    var dt = antes ? Math.min(t - antes, 60) : 0; antes = t;
    pintar(t, dt);
    raf = visible ? window.requestAnimationFrame(paso) : 0;
  }

  medir();
  if (quieto) { window.addEventListener('resize', medir); return; }   // sin animación si el sistema lo pide
  var temporizador;
  window.addEventListener('resize', function () { clearTimeout(temporizador); temporizador = setTimeout(medir, 150); });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (en) {
      visible = en[0].isIntersecting;
      if (visible && !raf) { antes = 0; raf = window.requestAnimationFrame(paso); }
    }).observe(pie);
  } else { visible = true; raf = window.requestAnimationFrame(paso); }
})();

/* Menú móvil: se cierra solo al tocar una sección y cambia su etiqueta de accesibilidad */
(function () {
  var panel = document.getElementById('nav');
  var boton = document.querySelector('.navbar-toggler');
  if (!panel || !boton || !window.bootstrap) return;
  panel.addEventListener('click', function (e) {
    if (e.target.closest('.nav-link') && panel.classList.contains('show')) {
      window.bootstrap.Collapse.getOrCreateInstance(panel).hide();
    }
  });
  panel.addEventListener('show.bs.collapse', function () { boton.setAttribute('aria-label', 'Cerrar menú'); });
  panel.addEventListener('hide.bs.collapse', function () { boton.setAttribute('aria-label', 'Abrir menú'); });
})();
