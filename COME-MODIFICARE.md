# Modificare il sito per Arianna

Apri **`contenuti.js`**: testi, foto e canzone vengono tutti da quel file.
Il titolo **“per arianna”** e lo stile restano nell’HTML e nel CSS.
Non servono compilazione, installazioni o modifiche all’HTML per aggiungere ricordi.

## Scrivere i testi

Sostituisci i placeholder tra parentesi quadre mantenendo le virgolette.

- `auguri`: testi della pagina “auguri”. Ogni voce di `paragrafi` è un paragrafo separato; puoi aggiungerne o toglierne.
- `firma`: la tua firma, mostrata nelle pagine dei ricordi.
- `ricordi`: i contenuti dei pianeti della home e dell’elenco “ricordi”.
- `titolo`: titolo di un ricordo.
- `descrizione`: testo nell’anteprima, nell’elenco e nella pagina del ricordo.
- `augurio`: il pensiero aggiuntivo nella pagina del ricordo.
- `didascalia`: testo sotto una foto nella galleria mobile.
- `alt`: descrizione della foto per i lettori di schermo.

Usa `""` per nascondere un testo. Per andare a capo usa `\n`, per esempio:

```js
descrizione: "Prima riga\nSeconda riga",
```

Gli apostrofi non richiedono modifiche. Se vuoi inserire delle virgolette doppie nel testo, scrivi `\"`, per esempio `"Mi hai detto \"auguri\""`.
I testi sono testo semplice: non occorre scrivere tag HTML.

## Aggiungere foto a un ricordo

1. Metti la nuova immagine nella cartella `foto`.
2. Trova il ricordo desiderato in `contenuti.js`.
3. Aggiungi un oggetto nella sua lista `foto`, separandolo dagli altri con una virgola:

```js
foto: [
  {
    file: "foto/prima-foto.jpg",
    didascalia: "La prima foto",
    alt: "Una breve descrizione dell’immagine",
  },
  {
    file: "foto/nuova-foto.jpg",
    didascalia: "La nuova foto",
    alt: "Una breve descrizione dell’immagine",
  },
],
```

La prima foto diventa anche l’anteprima del pianeta. Le altre compaiono nella stessa galleria.
Il ricordo con `foto: "tutte"` raccoglie automaticamente le foto di tutti gli altri ricordi, senza duplicati.

## Aggiungere un nuovo pianeta con la sua pagina

Aggiungi questo blocco nella lista `ricordi`, prima della parentesi quadra di chiusura, e personalizzalo:

```js
{
  id: "un-nuovo-ricordo",
  titolo: "Il titolo che preferisci",
  descrizione: "La tua descrizione",
  augurio: "Il tuo pensiero",
  foto: [
    {
      file: "foto/nuova-foto.jpg",
      didascalia: "La tua didascalia",
      alt: "Una breve descrizione dell’immagine",
    },
  ],
},
```

L’`id` deve essere unico: usa lettere minuscole, numeri e trattini.
Pianeta, voce nell’elenco, pagina e frecce di navigazione si aggiornano automaticamente.
La pagina condivisa è `ricordo.html?id=un-nuovo-ricordo`.

La home dispone automaticamente i pianeti sulle tre orbite. Il ricordo con `foto: "tutte"` diventa la stella rossa al centro; se non c’è una raccolta, viene usato il primo ricordo. Gli altri ricordi diventano pianeti colorati. Il campo `posizione` non viene usato dal sistema solare.

## Cambiare canzone

Metti il file nella cartella `mp3` e aggiorna `musica.file`.
`musica.volume` va da `0` (silenzio) a `1` (volume massimo).
Il sito prova ad avviare la canzone al primo hover su un pianeta o sulla stella rossa.
Se il browser richiede un’interazione per consentire l’audio, la canzone parte al primo click o tocco dentro il sito.
La riproduzione continua passando tra le pagine.
Il comando “suono” permette di metterla in pausa e riprenderla.

## Animazione del sistema solare

All’inizio di `js/content.js` trovi i due parametri della home:

```js
const sistemaSolare = {
  dimensione: 1,
  numeroStelline: 14,
};
```

`dimensione` è un moltiplicatore: `0.8` riduce il sistema del 20%, `1.2` lo ingrandisce del 20%. Il sistema resta proporzionato e la dimensione viene limitata allo spazio disponibile sullo schermo, anche su mobile.
`numeroStelline` controlla solo le stelline decorative senza foto: `0` le nasconde, `30` ne mostra trenta (massimo 200). Non modifica il numero dei pianeti, che dipende dai ricordi. Salva e ricarica la pagina dopo una modifica.

I pianeti orbitano lentamente attorno alla stella rossa. Passando il mouse o usando il tasto Tab si apre la foto con il testo del ricordo e le orbite si fermano. Un click apre la pagina del ricordo. Su smartphone, il primo tocco apre l’anteprima e un tocco sulla foto apre il ricordo; toccando lo sfondo si chiude l’anteprima. Anche il tasto Esc chiude la foto.

Le stelline decorative fluttuano e si allontanano leggermente dal mouse o dal dito. Gli SVG sono in `assets/solar`, lo stile in `css/style.css` e il movimento in `js/solar-system.js`. Le velocità delle orbite si regolano tramite `speed` in quel file.

La preferenza di sistema per il movimento ridotto ferma tutte le animazioni della home. Le animazioni si sospendono anche quando la scheda non è visibile.

La sezione `movimento` di `contenuti.js` regola solo le particelle rimaste nella pagina “auguri”: `diffusione` controlla il movimento casuale e `attrito` la persistenza della direzione.

## Vedere le modifiche

Salva `contenuti.js` e ricarica la pagina. Puoi usare Live Server, l’anteprima dell’IDE o aprire `index.html` nel browser.
Con Live Server o un sito pubblicato la musica continua anche durante la navigazione interna.
Aprendo direttamente i file dal disco, il browser può ricaricare la pagina quando segui un link, interrompendo la canzone.
