#!/usr/bin/env bash
# Rifà TUTTI i dati dell'app e ricostruisce il file pubblicabile.
#
# Perché esiste: i dati invecchiano da soli. Un aggiornamento di bilanciamento
# cambia le win rate, una rotazione cambia il pool delle mappe, e l'app non se
# ne accorge — continua a dare numeri precisi e vecchi, che è la forma di
# sbagliato più difficile da notare.
#
# Cosa NON fa: non pubblica e non committa. Quelle due cose le decide chi lo
# lancia, dopo aver guardato cosa è cambiato.
#
# Il profilo (potenza dei brawler) si aggiorna solo se c'è BS_TAG
# nell'ambiente. Il tag non sta MAI nel repository, che è pubblico.
set -uo pipefail
cd "$(dirname "$0")/.."
GIALLO='\033[33m'; ROSSO='\033[31m'; VERDE='\033[32m'; FINE='\033[0m'
problemi=0
passo() { printf "\n${GIALLO}== %s${FINE}\n" "$1"; }
fallito() { printf "${ROSSO}   FALLITO: %s${FINE}\n" "$1"; problemi=$((problemi+1)); }

passo "1/6  mappe di Classificata"
if node script/fetch-mappe-ranked.js > /tmp/bp-agg.json 2>/tmp/bp-agg.err; then
  tail -1 /tmp/bp-agg.err
  grep -q "PROBLEMA" /tmp/bp-agg.err && { grep "PROBLEMA" /tmp/bp-agg.err; fallito "una mappa non ha dati coerenti"; }
  node script/build-map-data.js /tmp/bp-agg.json 2>&1 | tail -2
else
  cat /tmp/bp-agg.err; fallito "non ho potuto scaricare le mappe"
fi

passo "2/6  matrice dei matchup e delle sinergie"
node script/fetch-matchup-matrix.js 2>&1 | tail -3 || fallito "matrice non aggiornata"

passo "3/6  profilo del giocatore"
if [ -n "${BS_TAG:-}" ]; then
  node script/fetch-profilo-brawl.js "$BS_TAG" 2>&1 | tail -2 || fallito "profilo non aggiornato"
  # Il tag non deve MAI finire nel file generato: il repository è pubblico.
  if grep -q "$BS_TAG" brawl-draft/profilo.js 2>/dev/null; then
    fallito "IL TAG È FINITO IN profilo.js — non pubblicare"
  fi
else
  echo "   BS_TAG non impostato: salto (il record personale non entra nel punteggio,"
  echo "   ma il filtro di potenza sì — va rifatto a mano quando sali un brawler)"
fi

passo "4/6  controlli"
node script/check-brawl-data.js 2>&1 | tail -2 | grep -q "nessun problema" || fallito "check-brawl-data"
node script/verifica-matrice.js 2>&1 | tail -1 | grep -q "identica alla fonte" || fallito "la matrice non combacia con la fonte"
node script/verifica-scorciatoia.js 2>&1 | tail -1 | grep -q "identica" || fallito "verifica-scorciatoia"
node script/verifica-generale.js 11 2>&1 | sed -n 3p | grep -q "rispettata" || fallito "l'invariante della forza avversario non regge"
echo "   controlli passati (o segnalati sopra)"

passo "5/6  il punteggio è ancora meglio del greedy?"
node script/misura-lookahead.js 11 18 2>&1 | grep -A2 "E L'APP" | tail -2

passo "6/6  ricostruzione del file pubblicabile"
node script/build-brawl-draft.js 2>&1 | tail -2 || fallito "build"
if grep -qE '#[0289PYLQGRJCUV]{4,12}([^0-9A-Za-z]|$)' brawl-draft/dist/app-completa.html; then
  fallito "c'è qualcosa che sembra un tag giocatore nel file pubblicabile"
fi

printf "\n"
if [ "$problemi" -gt 0 ]; then
  printf "${ROSSO}%s problemi: NON pubblicare finché non sono risolti.${FINE}\n" "$problemi"
  exit 1
fi
printf "${VERDE}Tutto a posto. Cosa è cambiato:${FINE}\n"
git --no-pager diff --stat -- brawl-draft/data.js brawl-draft/matrice.js brawl-draft/profilo.js
