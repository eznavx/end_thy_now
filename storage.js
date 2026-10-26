// GUARDADO: todo en localStorage, bajo una sola clave.
const Store = (() => {
  const KEY = 'apoc_v1';
  const BLOQUES = { I: [1, 3], II: [4, 11], III: [12, 22] };
  const vacio = () => ({ nick: null, caps: {} });
  const leer = () => { try { return JSON.parse(localStorage.getItem(KEY)) || vacio(); } catch { return vacio(); } };
  const escribir = d => { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch {} };
  const lista = b => Array.from({ length: BLOQUES[b][1] - BLOQUES[b][0] + 1 }, (_, i) => BLOQUES[b][0] + i);

  return {
    BLOQUES,
    nick: () => leer().nick,
    setNick(n) { const d = leer(); d.nick = n.trim().slice(0, 24); escribir(d); },
    cap: n => leer().caps[n] || null,   // { mejor:{c,t}, ultimo:{c,t}, intentos }
    // Guarda un intento; "mejor" solo cambia si el porcentaje sube.
    guardar(n, c, t) {
      const d = leer(), r = d.caps[n] || { mejor: { c, t }, intentos: 0 };
      if (c / t > r.mejor.c / r.mejor.t) r.mejor = { c, t };
      r.ultimo = { c, t }; r.intentos++; d.caps[n] = r; escribir(d); return r;
    },
    bloqueDe: n => Object.keys(BLOQUES).find(b => n >= BLOQUES[b][0] && n <= BLOQUES[b][1]),
    // Resultado de un bloque: suma de los MEJORES puntajes de sus capítulos.
    resumenBloque(b) {
      const caps = lista(b).map(n => ({ n, r: this.cap(n) }));
      const hechos = caps.filter(x => x.r);
      const c = hechos.reduce((s, x) => s + x.r.mejor.c, 0), t = hechos.reduce((s, x) => s + x.r.mejor.t, 0);
      return { bloque: b, completo: hechos.length === caps.length, c, t, pct: t ? Math.round(100 * c / t) : 0, caps };
    },
    // Resultado general + los 3 capítulos más débiles para repasar.
    resumenGeneral() {
      const bs = Object.keys(BLOQUES).map(b => this.resumenBloque(b));
      const c = bs.reduce((s, b) => s + b.c, 0), t = bs.reduce((s, b) => s + b.t, 0);
      const debiles = bs.flatMap(b => b.caps).filter(x => x.r)
        .sort((a, b) => a.r.mejor.c / a.r.mejor.t - b.r.mejor.c / b.r.mejor.t).slice(0, 3).map(x => x.n);
      return { completo: bs.every(b => b.completo), c, t, pct: t ? Math.round(100 * c / t) : 0, bloques: bs, debiles };
    },
    reset() { try { localStorage.removeItem(KEY); } catch {} }
  };
})();
