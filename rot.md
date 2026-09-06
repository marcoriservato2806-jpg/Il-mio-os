Cosa marcisce, ogni quanto, e cosa farci.

Un sistema del genere non si rompe tutto insieme: si scolla un pezzo alla volta, e i pezzi hanno velocità molto diverse. Sapere quale, ti evita di rifare tutto quando bastava sistemare una riga.

## Le velocità

| Pezzo | Dove sta | Quanto regge | Come te ne accorgi |
|---|---|---|---|
| **Chi sei** | `identity.md` | ~240 giorni | Gli output tornano a suonare come un'AI, o come una versione di te di un anno fa |
| **L'azienda** | `context/azienda.md` | ~180 giorni | Usa parole che qui dentro non usa più nessuno |
| **Le persone** | `context/persone.md` | quando cambia il team | Nomina qualcuno che se n'è andato, o non sa chi è arrivato |
| **Gli obiettivi** | `context/obiettivi.md` | ~90 giorni | Ti aiuta a fare bene una cosa che hai smesso di voler fare |
| **Dove stanno i dati** | `context/tool.md` | ~60 giorni | Cerca il foglio dove non c'è più |
| **Le regole** | `CLAUDE.md` | ~60 giorni | Ci sono dentro righe che non c'entrano più con come lavori |
| **Le tue skill** | `.claude/skills/` | ~24 giorni di uso | Ne apri una e la correggi ogni volta prima di lanciarla |
| **I collegamenti** | connettori, MCP | ore o giorni | Si rompono da soli. È normale |
| **La memoria** | `memoria/` | non marcisce, cresce | Se non cresce non è la memoria che è rotta, è che non stai facendo `/ingest` |

**Si costruisce dal centro e si manutiene dalla superficie.** Il centro sono `identity.md` e `context/`: li scrivi bene una volta e reggono mesi. La superficie sono i collegamenti e le skill: si rompono spesso, si buttano e si rifanno senza pensarci, e non è un problema del sistema.

La riga che vale la pena notare è l'ultima delle cose che marciscono: **i collegamenti, che durano ore, sono anche quelli da cui vorresti partire.** Vale per gli agenti la stessa cosa, ed è il motivo per cui qui non ce ne sono.

## La manutenzione, in pratica

Non serve un calendario. Serve accorgersene.

- **Quando un output non ti suona** e non capisci perché, il file da aprire è `identity.md`. Nove volte su dieci è quello.
- **Quando ti fa ripetere una cosa** che gli avevi già detto, non ridirgliela in chat: scrivila in `context/`. È la differenza tra spiegare e insegnare.
- **Quando ti chiede un dato che dovrebbe sapere**, il buco è in `context/`, non nella sua testa.
- **Ogni tre mesi**, rileggi `context/obiettivi.md`. È il file che invecchia peggio di tutti perché invecchia in silenzio: gli altri sbagliano in modo visibile, questo ti fa solo aiutare bene a fare la cosa sbagliata.

## Se un giorno vuoi un agente

Qui dentro non ce ne sono, ed è una scelta. Un agente non ti dà poteri nuovi. Ti dà un contenitore, e i contenitori sono tre:

| | Cosa ti dà | Quando serve davvero |
|---|---|---|
| **Contesto isolato** | il rumore (il dump di un foglio, una ricerca lunga) resta fuori dalla tua conversazione | quando il rumore è tanto e ti mangia la conversazione ogni volta |
| **Permessi ristretti** | può leggere una cosa e basta: niente scrittura, niente mail | quando il connettore in sola lettura non basta a legargli le mani |
| **Un posto dove sta scritto l'obiettivo** | la definizione di un mestiere in un file solo | quando quel file non è già una skill |

**Il test: se non sai dire quale delle tre ti serve, non ti serve un agente. Scrivi una skill.**

Vale la pena tenerlo a mente perché il mestiere più complicato che questo sistema sa fare, quello fiscale, sono cinque skill che si chiamano fra loro. Non un agente. Se ce la fa quello, il tuo probabilmente ce la fa.

E se ne aggiungi uno lo stesso, guarda dov'è finito nella tabella qui sopra, accanto ai collegamenti che si rompono da soli.
