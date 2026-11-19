# Modificare il sito per Arianna

Apri **`contenuti.js`**: testi, foto e canzone vengono tutti da quel file.
Il titolo **“per arianna”** e lo stile restano nell’HTML e nel CSS.
Non servono compilazione, installazioni o modifiche all’HTML per aggiungere ricordi.

## Scrivere i testi

Sostituisci i placeholder tra parentesi quadre mantenendo le virgolette.

- `auguri`: testi della pagina “auguri”. Ogni voce di `paragrafi` è un paragrafo separato; puoi aggiungerne o toglierne.
- `firma`: la tua firma, mostrata nelle pagine dei ricordi.
- `ricordi`: i contenuti dei puntini della home e dell’elenco “ricordi”.
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

La prima foto diventa anche l’anteprima del puntino. Le altre compaiono nella stessa galleria.
Il ricordo con `foto: "tutte"` raccoglie automaticamente le foto di tutti gli altri ricordi, senza duplicati.

## Aggiungere un nuovo puntino con la sua pagina

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
Puntino, voce nell’elenco, pagina e frecce di navigazione si aggiornano automaticamente.
La pagina condivisa è `ricordo.html?id=un-nuovo-ricordo`.

Puoi aggiungere `posizione: [30, 60]` per decidere dove appare il puntino: prima la distanza da sinistra, poi dall’alto, in percentuale.
Se ometti `posizione`, il sito ne sceglie una automaticamente. I cinque puntini iniziali mantengono le posizioni precedenti.

## Cambiare canzone

Metti il file nella cartella `mp3` e aggiorna `musica.file`.
`musica.volume` va da `0` (silenzio) a `1` (volume massimo).
Il sito prova ad avviare la canzone al primo hover su un puntino nero.
Se il browser richiede un’interazione per consentire l’audio, la canzone parte al primo click o tocco dentro il sito.
La riproduzione continua passando tra le pagine.
Il comando “suono” permette di metterla in pausa e riprenderla.

## Regolare il moto dei puntini

In `contenuti.js`, la sezione `movimento` controlla il moto browniano semplificato:

```js
movimento: {
  diffusione: 40,
  attrito: 1.2,
},
```

`diffusione` aumenta o riduce l’intensità del movimento casuale; `0` elimina il movimento spontaneo.
`attrito` regola la persistenza della direzione: un valore più basso dà traiettorie più lunghe e morbide; un valore più alto fa cambiare direzione più spesso.
I valori iniziali mantengono il movimento discreto. La home desktop conserva il suo ulteriore rallentamento.

Il modello usa impulsi gaussiani e attrito sulla velocità: `dv = -γ v dt + γ √(2D) dW`, `dx = v dt`, separatamente sui due assi.
La simulazione procede a intervalli fissi, indipendentemente dalla frequenza dello schermo.
I puntini restano entro i bordi, reagiscono al cursore e al tocco e si fermano quando esplori un’anteprima.
La preferenza di sistema per il movimento ridotto continua a fermare l’animazione.

## Vedere le modifiche

Salva `contenuti.js` e ricarica la pagina. Puoi usare Live Server, l’anteprima dell’IDE o aprire `index.html` nel browser.
Con Live Server o un sito pubblicato la musica continua anche durante la navigazione interna.
Aprendo direttamente i file dal disco, il browser può ricaricare la pagina quando segui un link, interrompendo la canzone.
