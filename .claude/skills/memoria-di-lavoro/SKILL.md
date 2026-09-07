---
name: memoria-di-lavoro
description: Come tenere la memoria di questo repository perché il lavoro si accumuli invece di ripartire da zero, e cosa fare quando salta fuori un errore — dove annotarlo, come capire se vale oltre il caso singolo, e come trasformarlo in un controllo automatico. Usala alla fine di ogni lavoro non banale, ogni volta che scopri un errore tuo o nei dati, quando ti accorgi di stare rifacendo a mano una cosa già fatta, e quando l'utente chiede di ricordare, imparare o migliorare. Usala anche prima di rispondere "non lo so" su qualcosa che potrebbe già essere scritto nella memoria.
---

# Tenere la memoria perché il lavoro si accumuli

Il punto di partenza è scomodo e va detto chiaro: **fra una conversazione e
l'altra non ricordo niente.** Non miglioro da solo. L'unica cosa che
attraversa il tempo sono i file di questo repository. Quindi "imparare" qui
vuol dire una cosa sola e concreta: **scrivere, nel posto dove verrà
ritrovato, quello che è costato fatica scoprire.**

Da cui la regola pratica più importante: **scrivi durante il lavoro, non
alla fine.** La conversazione può finire prima del previsto, e quello che è
rimasto solo nella conversazione è perso.

## Il ciclo dell'errore

Quando qualcosa va storto — un dato sbagliato, un bug, una conclusione che si
rivela falsa, una correzione dell'utente — passa da queste quattro domande.
Non è burocrazia: ognuna manda l'informazione in un posto diverso.

**1. Come è emerso?** Questa conta più di cosa era. Se l'errore è saltato
fuori da un test in browser, da uno script di controllo, da uno screenshot
dell'utente o da un dubbio suo, quella è l'informazione riutilizzabile: dice
*dove guardare la prossima volta*. Un elenco di errori senza il "come è
emerso" è una lista di aneddoti.

**2. Riguarda solo questo caso?** → `memoria/wiki/errori-trovati.md`, una
riga nella tabella. Serve a non ripagare la stessa verifica.

**3. Varrebbe anche su un altro lavoro?** → allora è una regola, e va in una
skill. Scrivila spiegando **perché**, non come divieto: "non fare X" si
dimentica, "X sembra giusto ma produce Y, ed è già successo" no.

**4. Si può far controllare a una macchina?** → allora è uno script in
`script/`. È il passaggio che la maggior parte delle volte viene saltato ed è
quello che vale di più: una regola scritta va ricordata, un controllo che gira
non si dimentica.

E poi **prova il controllo facendolo fallire di proposito.** Un controllo
scritto e mai messo alla prova passa senza accorgersi di niente: è già
successo con la regola che doveva tenere fuori un dato personale e che si
fermava un carattere prima di intercettarlo.

## La domanda che decide se una cosa va scritta

> Se rifacessi questo lavoro fra sei mesi senza ricordarmi niente, questa cosa
> la riscoprirei da zero?

Se sì, va scritta. Se no, non appesantire. Vale soprattutto per le cose che
sembrano ovvie *adesso*, alla fine di un ragionamento lungo: sono proprio
quelle che fra sei mesi non lo saranno.

## Dove va cosa

Le tre cartelle hanno tre proprietari e non si scambiano — è scritto in
`CLAUDE.md` e conviene rileggerlo, ma in sintesi:

- **`context/` è dell'utente.** Si applica, non si inventa. Se manca un dato,
  si chiede. **Prima di dire "non lo so", controlla che il file ci sia
  davvero:** `CLAUDE.md` rimandava a `context/azienda.md` mentre i file
  stavano nella radice, e per giorni ogni domanda sull'azienda ha trovato il
  vuoto pur essendo il dato a due passi. Ora c'è un controllo apposta.
- **`memoria/grezzo/` è dell'utente.** Si legge, non si tocca mai — né
  modificare, né rinominare, né cancellare, nemmeno per riordinare.
- **`memoria/wiki/` è mia.** È quello che ho capito, in pagine corte e
  collegate con `[[nome-file]]`.

## Come si scrive una pagina della wiki

Corta, e collegata. Una pagina che nessuno raggiunge non esiste.

- **Aggiorna `index.md` nella stessa passata.** Fuori dall'indice non si trova.
- **Collega**: `[[nome-file]]` senza `.md`, minuscolo coi trattini.
- **Metti come si è saputo**, non solo cosa si sa: una fonte, una misura, una
  data. Un'affermazione senza provenienza fra sei mesi non è verificabile.
- **Non ricopiare in prosa un dato che il sistema stampa già dai dati.** La
  copia in prosa è quella che resta indietro e mente: una nota diceva ancora
  "dati di fine luglio" con dati aggiornati a quel giorno. Se un generatore
  riscrive quei file, fagli ripulire anche le note.
- **Correggi le pagine vecchie quando cambiano i fatti**, invece di
  accumulare strati. Se una conclusione precedente era sbagliata, dillo e
  spiega perché: è più utile della conclusione giusta da sola.

## Il registro

Dopo un lavoro non banale, una riga in cima a `memoria/wiki/log.md`:

`## [AAAA-MM-GG HH:MM] tipo | cosa hai fatto`

Nuovo sempre in cima, formato rispettato — serve a leggerlo con un `grep` e a
controllare cosa è stato combinato mentre l'utente non c'era. Sotto, due o tre
righe che dicano **cosa è cambiato e perché**, non l'elenco dei file toccati:
quello lo dice già `git`.

## Il controllo, e perché non dipende da me

```bash
node script/check-memoria.js
```

**Gira da solo a fine turno**, tramite un hook `Stop` collegato in
`.claude/settings.json` che esegue `script/hook-memoria.sh`. Non è un
dettaglio tecnico: la disciplina della memoria era affidata al fatto che me
ne ricordassi, e "ricordarsi" è esattamente la cosa che qui non funziona —
fra una conversazione e l'altra non ricordo niente, e dentro una lunga la
regola si perde. Adesso lo esegue il programma. È il punto 4 del ciclo
dell'errore applicato al ciclo dell'errore stesso.

L'hook parla **solo quando c'è qualcosa che non va**: un avviso che compare
sempre viene ignorato dopo tre volte. Segnala due cose:
- la memoria è incoerente (uno dei controlli qui sotto fallisce);
- **c'è lavoro di oggi ma il registro non è stato aggiornato** — cioè sto per
  chiudere avendo fatto qualcosa senza annotarlo.

E il controllo, a sua volta, verifica che l'hook ci sia ancora e sia
collegato: se sparisce, la memoria tornerebbe a dipendere dalla mia buona
volontà senza che nessuno se ne accorga.

Verifica che ogni file citato in `CLAUDE.md` esista, che ogni pagina sia
nell'indice, che nessun `[[collegamento]]` sia morto, che il registro rispetti
formato e ordine, e che ogni skill abbia nome e descrizione (senza, non si
attiva mai — e una skill che non si attiva è lavoro buttato). Avvisa anche
quali file di contesto sono ancora al loro stato di modello: se sono vuoti, su
quegli argomenti non c'è contesto e va detto invece che dedotto.

Fallo girare quando hai finito di scrivere nella memoria.

## Cosa non fare

- Non scrivere pagine lunghe "per completezza": quello che non verrà riletto
  è peso, e il peso fa saltare la rilettura di tutto il resto.
- Non annotare un errore senza dire come è emerso.
- Non lasciare una scoperta solo nella risposta all'utente: la conversazione
  non attraversa il tempo, i file sì.
- Non inventare un dato per riempire un buco nella memoria. Un buco
  dichiarato è utile; un buco riempito bene è un danno che si scopre tardi.
