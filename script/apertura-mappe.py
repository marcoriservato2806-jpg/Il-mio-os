#!/usr/bin/env python3
"""Quanto e' APERTA una mappa, misurato dalla sua immagine.

Serve a rispondere a una domanda dell'utente: l'app non sa che una mappa e'
a spazi aperti, dove un Tank a corto raggio soffre. Prima di aggiungere una
descrizione della geometria scritta a mano — che sarebbe l'ennesima euristica
non calibrata — si controlla se una misura OGGETTIVA presa dall'immagine
spiega qualcosa delle win rate per classe.

La misura: in Brawl Stars i muri e gli ostacoli sono elementi piccoli e
contrastati sopra un fondo uniforme (erba, sabbia). Quindi la densita' di
BORDI nell'immagine e' un buon indice di quanto la mappa e' ingombra: alta =
labirinto, bassa = campo aperto.
"""
import sys, os, json
from PIL import Image, ImageFilter

d = sys.argv[1]
out = {}
for f in sorted(os.listdir(d)):
    if f.startswith("."):
        continue
    im = Image.open(os.path.join(d, f)).convert("L")
    im = im.resize((96, 96))
    bordi = im.filter(ImageFilter.FIND_EDGES)
    px = list(bordi.getdata()) if not hasattr(bordi, "get_flattened_data") else list(bordi.get_flattened_data())
    # quota di pixel con un bordo marcato
    densita = sum(1 for p in px if p > 40) / len(px)
    # varianza dei grigi: un campo aperto e' uniforme
    grigi = list(im.getdata()) if not hasattr(im, "get_flattened_data") else list(im.get_flattened_data())
    m = sum(grigi) / len(grigi)
    var = sum((p - m) ** 2 for p in grigi) / len(grigi)
    nome = os.path.splitext(f)[0]
    out[nome] = {"bordi": round(densita, 4), "varianza": round(var, 1)}
print(json.dumps(out, indent=1))
