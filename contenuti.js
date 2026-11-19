// MODIFICA QUI I TESTI, LE FOTO E LA CANZONE.
// I percorsi partono dalla cartella che contiene index.html.
// Puoi lasciare un testo vuoto ("") per nasconderlo.
// Per andare a capo in un testo, scrivi \n dentro le virgolette.
// La guida completa è in COME-MODIFICARE.md.

window.ARIANNA = {
  nome: "Arianna",
  firma: "[La tua firma]",

  musica: {
    file: "mp3/carro_armato.mp3",
    volume: 0.8, // Da 0 a 1.
  },

  auguri: {
    titolo: "[Titolo degli auguri]",
    introduzione: "[Scrivi qui una breve introduzione]",
    titoloElenco: "[Titolo dell’elenco]",
    elenco: [
      "[Prima voce]",
      "[Seconda voce]",
      "[Terza voce]",
    ],
    paragrafi: [
      "[Scrivi qui il primo paragrafo degli auguri]",
      "[Scrivi qui il secondo paragrafo]",
      "[Scrivi qui il terzo paragrafo]",
    ],
  },

  ricordi: [
    {
      id: "ricordo-1", // Un nome unico: usato nel link di questo ricordo.
      titolo: "[Titolo del ricordo 1]",
      descrizione: "[Scrivi qui la descrizione del primo ricordo]",
      augurio: "[Scrivi qui un pensiero o un augurio]",
      posizione: [22.4, 55.2], // Posizione del puntino, in percentuale. Facoltativa.
      foto: [
        {
          file: "foto/photo_6051028249535516617_w.jpg",
          didascalia: "[Didascalia della foto]",
          alt: "[Breve descrizione della foto per chi non può vederla]",
        },
        // Aggiungi altre foto qui, copiando il blocco qui sopra.
      ],
    },
    {
      id: "ricordo-2",
      titolo: "[Titolo del ricordo 2]",
      descrizione: "[Scrivi qui la descrizione del secondo ricordo]",
      augurio: "[Scrivi qui un pensiero o un augurio]",
      posizione: [40.5, 38.7],
      foto: [
        {
          file: "foto/photo_6051028249535516618_w.jpg",
          didascalia: "[Didascalia della foto]",
          alt: "[Breve descrizione della foto per chi non può vederla]",
        },
      ],
    },
    {
      id: "ricordo-3",
      titolo: "[Titolo del ricordo 3]",
      descrizione: "[Scrivi qui la descrizione del terzo ricordo]",
      augurio: "[Scrivi qui un pensiero o un augurio]",
      posizione: [52.6, 60.7],
      foto: [
        {
          file: "foto/photo_6051028249535516619_y.jpg",
          didascalia: "[Didascalia della foto]",
          alt: "[Breve descrizione della foto per chi non può vederla]",
        },
      ],
    },
    {
      id: "ricordo-4",
      titolo: "[Titolo del ricordo 4]",
      descrizione: "[Scrivi qui la descrizione del quarto ricordo]",
      augurio: "[Scrivi qui un pensiero o un augurio]",
      posizione: [57.1, 42.6],
      foto: [
        {
          file: "foto/photo_6051028249535516620_w.jpg",
          didascalia: "[Didascalia della foto]",
          alt: "[Breve descrizione della foto per chi non può vederla]",
        },
      ],
    },
    {
      id: "tutti-i-ricordi",
      titolo: "[Titolo della raccolta]",
      descrizione: "[Scrivi qui una descrizione della raccolta]",
      augurio: "[Scrivi qui un pensiero o un augurio]",
      posizione: [76.1, 35.1],
      foto: "tutte", // Raccoglie automaticamente anche le foto che aggiungerai.
    },
    // Per creare un nuovo puntino e una nuova pagina, copia un intero ricordo
    // qui sopra e cambia il suo id. Non occorre creare altri file HTML.
  ],
};
