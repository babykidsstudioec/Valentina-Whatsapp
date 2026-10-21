/* BabyKids Studio — Invitación Valentina Premium · Confirmación por WhatsApp */
(() => {
  'use strict';
  const cfg = window.BABYKIDS_CONFIG || {};
  const $ = id => document.getElementById(id);
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let opened = false;

  /* Siempre comenzar arriba, incluso al volver desde otra pestaña o usando Atrás.
     Se neutraliza el scroll suave solo durante el reposicionamiento. */
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  function goToTop() {
    const root = document.documentElement;
    const prior = root.style.scrollBehavior;
    root.style.scrollBehavior = 'auto';
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    root.scrollTop = 0;
    document.body.scrollTop = 0;
    requestAnimationFrame(() => { root.style.scrollBehavior = prior; });
  }
  goToTop();
  window.addEventListener('load', goToTop);
  window.addEventListener('pageshow', event => {
    goToTop();
    requestAnimationFrame(goToTop);
    // Safari/iPhone también puede restaurar el desplazamiento algo más tarde.
    setTimeout(goToTop, 100);
    if (event.persisted) {
      // Al regresar mediante el historial, vuelve a mostrar el sobre inicial.
      opened = false;
      const overlay = document.getElementById('magic-gate');
      const open = document.getElementById('open-envelope');
      if (overlay && open) {
        overlay.hidden = false;
        overlay.classList.remove('opening', 'gone');
        document.body.classList.remove('invitation-open');
        open.disabled = false;
        document.getElementById('gate-hint').textContent = '♡ Pulsa el sobre para abrirlo ♡';
        const audioEl = document.getElementById('birthday-audio');
        if (audioEl && !audioEl.paused) audioEl.pause();
      }
    }
  });

  /* Música — la mayoría de navegadores exige un toque del usuario */
  const audio = $('birthday-audio');
  // Los archivos originales de imagen y música se incluyen en el ZIP.
  // Si un archivo falta, el navegador mostrará la imagen alternativa o el audio no sonará.

  const musicBtn = $('music-button');
  async function toggleMusic() {
    if (!audio.paused) { audio.pause(); return; }
    try { audio.volume = .53; await audio.play(); } catch (e) { console.info('Toca Play para activar la música', e); }
  }
  function refreshMusic() {
    const playing = !audio.paused;
    musicBtn.textContent = playing ? 'Ⅱ' : '▶';
    musicBtn.setAttribute('aria-pressed', String(playing));
    musicBtn.setAttribute('aria-label', playing ? 'Pausar música' : 'Reproducir música');
  }
  musicBtn.addEventListener('click', toggleMusic);
  audio.addEventListener('pause', refreshMusic);
  audio.addEventListener('play', refreshMusic);

  /* Apertura del sobre y lluvia de mariposas / destellos */
  const gate = $('magic-gate'), openBtn = $('open-envelope');
  function magicBurst() {
    const root = $('magic-particles');
    if (!root) return;
    // Dibujadas con SVG para que las mariposas se vean igual en iPhone y Android.
    // Se colocan alrededor de la pantalla (no encima del formulario) y sobreviven
    // a la transición del sobre para que el usuario alcance a verlas.
    const butterflySVG = `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M31 31C14 2-2 10 7 29c4 9 14 10 23 7-17 5-19 26-6 23 8-2 10-13 10-22" fill="#e9a7c2" stroke="#b37791" stroke-width="1.3"/>
      <path d="M33 31C50 2 66 10 57 29c-4 9-14 10-23 7 17 5 19 26 6 23-8-2-10-13-10-22" fill="#edc5d2" stroke="#b37791" stroke-width="1.3"/>
      <path d="M31 29c-8-10-17-14-21-11M33 29c8-10 17-14 21-11" fill="none" stroke="#fff7eb" stroke-width="2"/>
      <path d="M31 21c-8-8-4-14-7-15M33 21c8-8 4-14 7-15" fill="none" stroke="#987285" stroke-width="1.8" stroke-linecap="round"/>
      <path d="M32 22q-5 13 0 28q5-15 0-28" fill="#987285"/>
      <circle cx="19" cy="27" r="2.5" fill="#fff8ed" opacity=".95"/>
      <circle cx="45" cy="27" r="2.5" fill="#fff8ed" opacity=".95"/>
    </svg>`;
    const amount = window.matchMedia('(max-width:640px)').matches ? 10 : 13;
    for (let i = 0; i < amount; i++) {
      const part = document.createElement('span');
      part.className = 'butterfly-fly';
      part.setAttribute('aria-hidden','true');
      part.innerHTML = butterflySVG;
      // Concentradas a los costados, para no tapar el nombre Valentina.
      const side = i % 2 === 0;
      const x = side ? 2 + Math.random() * 23 : 74 + Math.random() * 22;
      part.style.setProperty('--bx', `${x}vw`);
      part.style.setProperty('--by', `${17 + Math.random() * 60}vh`);
      part.style.setProperty('--bsize', `${25 + Math.random() * 22}px`);
      part.style.setProperty('--dx', `${-45 + Math.random() * 90}px`);
      part.style.setProperty('--bdelay', `${Math.random() * 1.0}s`);
      part.style.setProperty('--duration', `${4.7 + Math.random() * 1.7}s`);
      root.appendChild(part);
      if (reduced) {
        // El efecto visual queda estático y breve, respetando accesibilidad.
        setTimeout(() => part.remove(), 3200);
      } else {
        part.addEventListener('animationend', () => part.remove(), {once:true});
        setTimeout(() => part.remove(), 9500);
      }
    }
    if (reduced) return;
    const chars = ['♡','♡','♡','♡'];
    for (let i = 0; i < 16; i++) {
      const part = document.createElement('span');
      part.className = 'particle'; part.textContent = chars[i % chars.length];
      part.style.setProperty('--x', `${7 + Math.random()*86}vw`);
      part.style.setProperty('--delay', `${Math.random()*.85}s`);
      part.style.setProperty('--drift', `${-90+Math.random()*180}px`);
      part.style.setProperty('--time', `${3 + Math.random()*2}s`);
      part.style.fontSize = `${14 + Math.random()*15}px`;
      root.appendChild(part);
      part.addEventListener('animationend', () => part.remove(), {once:true});
      setTimeout(() => part.remove(), 8500);
    }
  }
  openBtn.addEventListener('click', () => {
    if (opened) return;
    opened = true; openBtn.disabled = true;
    gate.classList.add('opening');
    $('gate-hint').textContent = '♡ Tu sorpresa está por comenzar ♡';
    // El gesto del usuario permite intentar reproducir audio.
    if (audio.paused) toggleMusic();
    const pause = reduced ? 40 : 1450;
    setTimeout(() => {
      // La tarjeta siempre se revela desde el comienzo, no desde el último scroll.
      goToTop();
      gate.classList.add('gone');
      document.body.classList.add('invitation-open');
      requestAnimationFrame(goToTop);
      magicBurst();
      setTimeout(() => { gate.hidden = true; }, reduced ? 50 : 850);
    }, pause);
  });

  /* Fecha, cuenta regresiva y ubicación */
  $('valentina-title').textContent = String(cfg.nombre || 'Valentina');
  $('event-message').textContent = String(cfg.mensaje || 'Un día mágico para compartir juntos.');
  $('place-text').textContent = String(cfg.lugar || 'El bosque encantado');
  if (/^https:\/\//.test(String(cfg.mapa || ''))) $('map-button').href = cfg.mapa;
  const date = String(cfg.fecha || '2026-12-24');
  const hr = String(cfg.hora || '15:00');
  const offset = /^[-+]\d\d:\d\d$/.test(cfg.zonaHorariaUTC) ? cfg.zonaHorariaUTC : '-05:00';
  const [year,month,day] = date.split('-').map(Number), [hh,mm] = hr.split(':').map(Number);
  if ([year,month,day,hh,mm].every(Number.isFinite)) {
    const d = new Date(Date.UTC(year,month-1,day));
    $('date-text').textContent = new Intl.DateTimeFormat('es-EC',{day:'numeric',month:'long',year:'numeric',weekday:'long',timeZone:'UTC'}).format(d);
    $('time-text').textContent = new Intl.DateTimeFormat('es-EC',{hour:'numeric',minute:'2-digit',hour12:true,timeZone:'UTC'}).format(new Date(Date.UTC(2026,0,1,hh,mm)));
  }
  const eventTS = Date.parse(`${date}T${hr}:00${offset}`);
  function countdown() {
    if (!Number.isFinite(eventTS)) return;
    let left = Math.max(0,eventTS-Date.now());
    const d = Math.floor(left/86400000);left%=86400000;
    const h = Math.floor(left/3600000);left%=3600000;
    const m = Math.floor(left/60000);const s=Math.floor(left%60000/1000);
    [d,h,m,s].forEach((v,i)=>{ $(['days','hours','minutes','seconds'][i]).textContent=String(v).padStart(2,'0'); });
    if (eventTS<=Date.now()) $('countdown-note').textContent='¡Gracias por ser parte de esta celebración!';
  }
  countdown(); setInterval(countdown,1000);

  /* Confirmación directa por WhatsApp */
  const phone = String(cfg.whatsapp || '').replace(/\D/g, '');
  const message = String(cfg.mensajeWhatsApp || '¡Hola, Valentina! 💖 Con mucha alegría confirmo mi asistencia a tu cumpleaños. Será un gusto acompañarte y compartir contigo este día tan especial. ¡Gracias por invitarme! ✨');
  const confirmButton = $('confirm-button');
  if (/^[1-9]\d{7,14}$/.test(phone)) {
    confirmButton.href = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  } else {
    confirmButton.removeAttribute('href');
    confirmButton.setAttribute('aria-disabled', 'true');
    $('whatsapp-note').textContent = 'Falta configurar el número de WhatsApp del organizador.';
  }
})();
