# Il tuo OS

Un assistente che ti conosce. Quattro cose: un carattere, una memoria, mani e occhi, delle regole.

Questa cartella è quasi vuota, ed è voluto. Si riempie al primo comando.

## Si parte così

1. Apri questa cartella in Claude Code, app desktop: **File → Open Folder**.
2. Scrivi `/setup`.
3. Dagli qualcosa che parla di te: il tuo sito, il tuo profilo LinkedIn, l'export di una chat di lavoro. Anche uno solo.

Cinque minuti e i file se li scrive lui. Poi te li rilegge e ti chiede cosa cambieresti.

> **Non compilare i file a mano prima di lanciare `/setup`.** Correggere una bozza è cinque volte più veloce che riempire una pagina bianca, ed è tutto il motivo per cui questo template è vuoto invece che pieno di placeholder da sostituire.

## Cosa c'è dentro

| | |
|---|---|
| `identity.md` | chi sei e come parli. Il file più importante della cartella |
| `context/` | l'azienda, le persone, i tool, gli obiettivi. **Lo scrivi tu, lui lo applica** |
| `memoria/grezzo/` | ci butti dentro roba: PDF, trascrizioni, export. **Lui non la tocca mai** |
| `memoria/wiki/` | quello che ha capito dal grezzo, in pagine collegate. **La scrive solo lui** |
| `script/` | gli attrezzi che si costruisce da solo mentre lavorate |
| `CLAUDE.md` | l'indice: dice a Claude cosa leggere e quando |
| `rot.md` | cosa marcisce, ogni quanto, e cosa fare quando succede |
| `.claude/` | le tre skill di sistema e i tre hook |

Le tre cartelle di memoria hanno **tre proprietari diversi**, ed è la cosa che fa la differenza tra un assistente che accumula e uno che si ripete. Tu scrivi in `grezzo/` e in `context/`, lui scrive in `wiki/`. Nessuno dei due scrive dove scrive l'altro.

## Le tre skill che trovi già dentro

Scrivi `/` e le vedi nel menu. Non c'è niente da installare.

- **`/setup`** una volta sola, all'inizio.
- **`/ingest`** quando metti qualcosa in `memoria/grezzo/` e vuoi che diventi consultabile.
- **`/query`** quando gli chiedi qualcosa che sa solo lui, e la risposta resta dentro invece di evaporare a fine conversazione.

Sono skill **di sistema**: fanno funzionare la cartella e sono uguali per tutti. Le skill **di lavoro**, quelle del tuo mestiere, le scrivi tu. Il template ne consegna zero apposta: non so qual è il tuo mestiere, e una skill che non usi è peggio di una skill che non c'è.

Il criterio per capire se una cosa merita una skill: **c'è un punto di giudizio che si ripete?** Se non c'è giudizio è uno script. Se il giudizio non si ripete è un prompt. La skill sta in mezzo, ed è l'unico posto dove vale la pena spenderci venti minuti.

## I tre hook

Un hook non è una regola. Una regola gliela chiedi e lui la rispetta quasi sempre. **Un hook è un comando che parte da solo, che lui voglia o no.** Non sta nel prompt, sta nella macchina. Sono in `.claude/settings.json`, e sono le tre cose su cui non ti conviene fidarti di nessuno.

| Hook | Quando parte | Cosa fa |
|---|---|---|
| **Niente esce** | prima di un commit | cerca quello che sta in `.claude/segreti.txt` e blocca il commit se lo trova |
| **Niente entra alla cieca** | prima che parta una skill | guarda dentro il file e ti avvisa se ci sono righe che parlano a lui invece che a te |
| **Niente si perde** | dopo ogni modifica | commit automatico, così torni indietro quando ti rompe qualcosa |

Uscita, entrata, ripristino.

> **Il secondo hook è una rete, non uno scudo.** Chi vuole aggirarlo ci riesce, e va detto. Serve perché il 95% di quello che gira in giro non è sofisticato, e perché ti obbliga a guardare un file che altrimenti lanceresti a occhi chiusi. Chiunque ti dica che una cosa così ti protegge ti sta mentendo sulla cosa sbagliata.

Il terzo hook ha bisogno di `git` per esistere: senza, non c'è un posto dove tornare indietro. Non devi farci niente, se ne occupa `/setup` al primo avvio. Su Mac e Linux `bash` e `git` ci sono già, su Windows serve WSL o Git Bash.

## Agenti: non ce ne sono

Non è una dimenticanza. Un agente non ti dà poteri nuovi, ti dà un contenitore: contesto isolato, permessi ristretti, un posto solo dove sta scritto l'obiettivo. Tre cose, tutte e tre contenitori.

**Se non sai dire quale delle tre ti serve, non ti serve un agente: scrivi una skill.** Il test per intero è in `rot.md`.

## Quando `CLAUDE.md` va spezzato

`CLAUDE.md` viene caricato a ogni conversazione, quindi ogni riga che ci metti la paghi sempre, anche quando non serve. Per questo è un indice e non un contenitore.

La regola: **se una cosa serve in meno di una conversazione su tre, non va in `CLAUDE.md`.** Va in un file dentro `context/`, e nell'indice resta una riga che dice quando aprirlo.

Segnali che è ora di spezzarlo:

- ha passato le cento righe
- ci sono dentro degli elenchi (di clienti, di prodotti, di passaggi di un processo solo)
- una sezione la usa un tipo di lavoro solo

Sposti la sezione in `context/come-si-chiama.md`, aggiungi la riga nella tabella dell'indice, e hai finito.
