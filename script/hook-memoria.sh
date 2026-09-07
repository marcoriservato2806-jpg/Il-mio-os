#!/usr/bin/env bash
# Hook di fine turno: controlla la memoria e avvisa se si è lavorato senza
# scrivere nel registro.
#
# Perché esiste. La disciplina della memoria era affidata al fatto che io me
# ne ricordassi. Ma "ricordarsi" è esattamente la cosa che non funziona: fra
# una conversazione e l'altra non ricordo niente, e dentro una conversazione
# lunga la regola scritta in CLAUDE.md può perdersi. Questo lo esegue il
# programma, non io — è il punto 4 del ciclo dell'errore applicato al ciclo
# dell'errore stesso.
#
# Parla solo quando c'è qualcosa che non va: un hook che avvisa sempre viene
# ignorato dopo tre volte.
set -uo pipefail
cd "$(dirname "$0")/.." || exit 0

avvisi=""

# 1. La memoria è coerente? (indice che punta nel vuoto, link morti, registro
#    fuori formato, skill senza descrizione)
if command -v node >/dev/null 2>&1 && [ -f script/check-memoria.js ]; then
  if ! out=$(node script/check-memoria.js 2>&1); then
    problemi=$(printf '%s' "$out" | grep '✗' | sed 's/^ *//' | paste -sd '; ' -)
    avvisi="Memoria da sistemare — ${problemi}"
  fi
fi

# 2. Si è lavorato senza annotarlo? Confronta l'ultima voce del registro con
#    l'ultima modifica ai file di lavoro. Se ho toccato qualcosa dopo aver
#    scritto nel registro (o senza averci scritto affatto), va annotato.
if [ -f memoria/wiki/log.md ] && command -v git >/dev/null 2>&1; then
  ultima_voce=$(grep -m1 -oE '^## \[[0-9]{4}-[0-9]{2}-[0-9]{2}' memoria/wiki/log.md | tr -d '#[ ' || true)
  oggi=$(date +%F)
  # "lavoro": modifiche non salvate, o commit di oggi che non toccano il registro
  sporco=$(git status --porcelain 2>/dev/null | grep -v 'memoria/wiki/log.md' | head -1 || true)
  commit_oggi=$(git log --since="$oggi 00:00" --format=%H 2>/dev/null | head -1 || true)
  if [ -n "$sporco" ] || [ -n "$commit_oggi" ]; then
    if [ "$ultima_voce" != "$oggi" ]; then
      nota="C'è lavoro di oggi ma l'ultima voce del registro è del ${ultima_voce:-mai}: aggiungi una riga in cima a memoria/wiki/log.md."
      avvisi="${avvisi:+$avvisi | }$nota"
    fi
  fi
fi

[ -z "$avvisi" ] && exit 0
printf '{"systemMessage": %s}\n' "$(printf '%s' "$avvisi" | python3 -c 'import json,sys; print(json.dumps(sys.stdin.read()))')"
