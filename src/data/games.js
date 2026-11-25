export const HTML_GAMES = [
  {
    id: "omec-n2",
    subjectId: "matematica",
    title: "Reto InFIFnito",
    blurb: "OMEC N2 · permutaciones, geometría y calendario.",
    src: "/games/omec-n2.html",
    icon: "♾️",
    featured: true,
  },
  {
    id: "buscaminas",
    subjectId: "matematica",
    title: "Buscaminas",
    blurb: "Probabilidad, inferencia y casillas 0 o 1.",
    src: "/games/buscaminas.html",
    icon: "🔍",
  },
  {
    id: "memoria-arte",
    subjectId: "arte",
    title: "Memoria de arte",
    blurb: "Empareja la obra con su artista.",
    src: "/games/memoria-arte.html",
    icon: "🎨",
  },
];

export function gamesForSubject(subjectId) {
  return HTML_GAMES.filter((game) => game.subjectId === subjectId);
}

export function getHtmlGame(id) {
  return HTML_GAMES.find((game) => game.id === id) || null;
}
