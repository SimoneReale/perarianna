// MODIFICA QUI I TESTI, LE FOTO E LA CANZONE.
// I percorsi partono dalla cartella che contiene index.html.
// Puoi lasciare un testo vuoto ("") per nasconderlo.
// Per andare a capo in un testo, scrivi \n dentro le virgolette.
// La guida completa è in COME-MODIFICARE.md.

window.ARIANNA = {
  nome: "",
  firma: "",

  musica: {
    file: "mp3/carro_armato.mp3",
    volume: 0.8, // Da 0 a 1.
  },

  // Particelle nella pagina “auguri”; la home usa js/solar-system.js.
  movimento: {
    diffusione: 40, // Intensità del moto browniano, in pixel²/secondo.
    attrito: 1.2, // Quanto rapidamente si perde l’inerzia, in 1/secondo.
  },

  auguri: {
    titolo: "auguri",
    // Movimento dei soli testi nella lista "paragrafi" qui sotto.
    movimentoParagrafi: {
      attivo: true,           // false = testo fermo.
      ampiezzaX: 20,          // Spostamento massimo orizzontale, in pixel.
      ampiezzaY: 20,          // Spostamento massimo verticale, in pixel.
      intensita: 3,          // Forza del moto casuale; 0 = solo mouse/tocco.
      velocita: 0.5,            // Moltiplicatore: 0.5 = lento, 2 = veloce, 0 = fermo.
      reattivitaMouse: 0.5,     // Moltiplicatore della spinta del cursore; 0 la disattiva.
      reattivitaTocco: 0.5,     // Moltiplicatore della spinta del dito; 0 la disattiva.
      raggio: 180,            // Distanza a cui mouse e tocco agiscono, in pixel.
      ritorno: 0.5,           // Richiamo verso la posizione iniziale; 0 lo elimina.
    },
    // introduzione: "[Scrivi qui una breve introduzione]",
    // titoloElenco: "[Titolo dell’elenco]",
    // elenco: [
    //   "[Prima voce]",
    //   "[Seconda voce]",
    //   "[Terza voce]",
    // ],
    paragrafi: [
      "Ciao Arianna, sei un topo.\n Un topo certamente speciale,",
      "ma pur sempre un topo.",
      "Un topone qualcuno potrebbe dire.",
      "I tuoi amici non sono topi, perlomeno non tutti.\n Ad ogni modo ti vogliono un gran bene."
    ],
  },

  ricordi: [
    {
      id: "ricordo-1", // Un nome unico: usato nel link di questo ricordo.
      titolo: "Alice",
      descrizione: "buon compleanno, thank you for being the sbork to my sbirk⭐️",
      augurio: "",
      posizione: [22.4, 55.2], // Posizione della versione precedente; non usata dalle orbite.
      foto: [
        {
          file: "foto/alice.jpeg",
          didascalia: "als",
          alt: "",
        },
        // Aggiungi altre foto qui, copiando il blocco qui sopra.
      ],
    },
    {
      id: "ricordo-2",
      titolo: "alessandra",
      descrizione: "la mia casetta x sempre tvb <3",
      augurio: "",
      posizione: [40.5, 38.7],
      foto: [
        {
          file: "foto/alessandra.jpeg",
          didascalia: "ale",
          alt: "",
        },
      ],
    },
    {
      id: "ricordo-3",
      titolo: "valeria",
      descrizione: "Stai proprio diventando vecchia, ma non ti preoccupare la spingo io la carrozzella Angela💙",
      augurio: "",
      posizione: [52.6, 60.7],
      foto: [
        {
          file: "foto/valeria.jpeg",
          didascalia: "vale",
          alt: "",
        },
      ],
    },
    {
      id: "ricordo-4",
      titolo: "costantino",
      descrizione: "Fake identities, real friendship, endless plot twists",
      augurio: "",
      posizione: [57.1, 42.6],
      foto: [
        {
          file: "foto/costantino.jpeg",
          didascalia: "costa",
          alt: "",
        },
      ],
    },
    {
      id: "ricordo-5",
      titolo: "elena",
      descrizione: "x sempre noi, AUGURI PIPI ⭐️",
      augurio: "",
      posizione: [57.1, 42.6],
      foto: [
        {
          file: "foto/elena.jpeg",
          didascalia: "ele",
          alt: "",
        },
      ],
    },
    {
      id: "ricordo-6",
      titolo: "francesca e antonio",
      descrizione: "buon compleanno da mamma&papà per la nostra primogenita ANGELA",
      augurio: "",
      posizione: [57.1, 42.6],
      foto: [
        {
          file: "foto/francesca.jpeg",
          didascalia: "fra & tony",
          alt: "",
        },
      ],
    },
    {
      id: "ricordo-7",
      titolo: "giulia",
      descrizione: "Con amore e allegria, tanti auguri arianna mia",
      augurio: "",
      posizione: [57.1, 42.6],
      foto: [
        {
          file: "foto/giulia.jpeg",
          didascalia: "spina",
          alt: "",
        },
      ],
    },
    {
      id: "ricordo-8",
      titolo: "martina",
      descrizione: "Che tutta l’energia che emani possa restare sempre la stessa, tanti auguri bimbina",
      augurio: "",
      posizione: [57.1, 42.6],
      foto: [
        {
          file: "foto/martina.jpeg",
          didascalia: "marti",
          alt: "",
        },
      ],
    },
    {
      id: "ricordo-9",
      titolo: "michele",
      descrizione: "“La Chioccetta per l'aia azzurra va col suo pigolio di stelle.” Ti amo x sempre ❤️⭐️",
      augurio: "",
      posizione: [57.1, 42.6],
      foto: [
        {
          file: "foto/michele.jpeg",
          didascalia: "michi",
          alt: "",
        },
      ],
    },
    {
      id: "ricordo-10",
      titolo: "raffaella",
      descrizione: "A milano nel giorno del tuo compleanno ieri, oggi e xsempre❤️",
      augurio: "",
      posizione: [57.1, 42.6],
      foto: [
        {
          file: "foto/raffaella.jpeg",
          didascalia: "raffi",
          alt: "",
        },
      ],
    },
    {
      id: "ricordo-11",
      titolo: "sonia",
      descrizione: "Non meriti i miei auguri però auguri lo stesso, tvb❤️",
      augurio: "",
      posizione: [57.1, 42.6],
      foto: [
        {
          file: "foto/sonia.jpeg",
          didascalia: "sonia",
          alt: "",
        },
      ],
    },
    {
      id: "ricordo-12",
      titolo: "simone",
      descrizione: "smac auguri smac",
      augurio: "",
      posizione: [57.1, 42.6],
      foto: [
        {
          file: "foto/simone.jpg",
          didascalia: "topo",
          alt: "",
        },
      ],
    },
    {
      id: "tutti-i-ricordi",
      titolo: "Tutti assieme",
      descrizione: "ma proprio tutti",
      augurio: "",
      posizione: [76.1, 35.1],
      foto: "tutte", // Raccoglie automaticamente anche le foto che aggiungerai.
    },
    // Per creare un nuovo pianeta e una nuova pagina, copia un intero ricordo
    // qui sopra e cambia il suo id. Non occorre creare altri file HTML.
  ],
};
