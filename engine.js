// MOTOR: mezcla, califica y controla el tiempo de un capítulo.
const Engine = (() => {
  const mezclar = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  // Revisa el banco entero; devuelve la lista de errores (vacía = todo bien).
  function validar() {
    const e = [];
    for (const [cap, qs] of Object.entries(PREGUNTAS)) qs.forEach(([q, ops, ok], i) => {
      const id = `Cap ${cap}, pregunta ${i + 1}`;
      if (!q) e.push(id + ': sin texto');
      if (!Array.isArray(ops) || ops.length !== 4) e.push(id + ': debe tener 4 opciones');
      else if (new Set(ops).size !== 4) e.push(id + ': opciones repetidas');
      if (!Number.isInteger(ok) || ok < 0 || ok > 3) e.push(id + ': índice correcto inválido');
    });
    return e;
  }

  function crear(cap, segundos = 20) {
    if (!PREGUNTAS[cap]) return null;
    // Cada opción lleva su marca "ok", así no importa cómo se mezclen.
    const ps = mezclar(PREGUNTAS[cap]).map(([q, ops, ok]) => ({ q, ops: mezclar(ops.map((t, i) => ({ t, ok: i === ok }))) }));
    let i = 0, aciertos = 0, respondida = false, timer = null;
    return {
      cap, total: ps.length,
      actual: () => ({ n: i + 1, total: ps.length, texto: ps[i].q, opciones: ps[i].ops.map(o => o.t) }),
      responder(k) {                       // k = -1 significa "se acabó el tiempo"
        if (respondida) return null;
        respondida = true; clearInterval(timer);
        const ok = ps[i].ops[k]?.ok === true; if (ok) aciertos++;
        return { ok, correcta: ps[i].ops.findIndex(o => o.ok) };
      },
      siguiente() { i++; respondida = false; return i < ps.length; },
      iniciarTiempo(onTick, onFin) {
        let t = segundos; onTick(t);
        timer = setInterval(() => { t--; onTick(t); if (t <= 0) onFin(this.responder(-1)); }, 1000);
      },
      detener: () => clearInterval(timer),
      resultado: () => ({ cap, c: aciertos, t: ps.length })
    };
  }
  return { crear, validar };
})();
