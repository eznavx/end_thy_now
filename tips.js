// Consejos para la pantalla "Prepárate".
const TIPS = [
  'Relájate y respira hondo antes de empezar.',
  'Lee la pregunta completa antes de mirar las opciones.',
  'Fíjate en las palabras exactas: un solo término cambia la respuesta.',
  'Si dudas entre dos, descarta primero la que sabes que es falsa.',
  'No te quedes pegado: respóndela y sigue; el tiempo corre.',
  'En una competencia, el error de una pregunta no debe afectar la siguiente.',
  'Repasa los números y las listas en orden: son favoritos de los jurados.',
  'Lee el texto bíblico en voz alta; se te queda mejor.'
];
const tipAleatorio = () => TIPS[Math.floor(Math.random() * TIPS.length)];
