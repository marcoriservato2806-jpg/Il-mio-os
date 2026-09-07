#!/usr/bin/env python3
"""Ridimensiona i ritratti scaricati e li scrive come data URI in ritratti.js.

Chiamato da script/fetch-ritratti.js, non a mano.
"""
import base64, io, json, os, sys
from PIL import Image

LATO = 96      # a schermo se ne vedono ~52px: 96 basta anche sui display retina
QUALITA = 80

src, dest = sys.argv[1], sys.argv[2]
nomi = {}
with open(os.path.join(src, "nomi.tsv"), encoding="utf8") as f:
    for riga in f:
        i, n = riga.rstrip("\n").split("\t")
        nomi[i] = n

voci, totale = [], 0
for ident in sorted(nomi, key=lambda k: nomi[k]):
    p = os.path.join(src, f"{ident}.png")
    if not os.path.exists(p):
        continue
    im = Image.open(p).convert("RGBA")
    im.thumbnail((LATO, LATO), Image.LANCZOS)
    buf = io.BytesIO()
    im.save(buf, "WEBP", quality=QUALITA, method=6)
    b64 = base64.b64encode(buf.getvalue()).decode()
    totale += len(b64)
    voci.append(f'  {json.dumps(nomi[ident], ensure_ascii=False)}: "data:image/webp;base64,{b64}",')

with open(dest, "w", encoding="utf8") as f:
    f.write("""// Ritratti dei brawler, incorporati come data URI.
// GENERATO da script/fetch-ritratti.js — non modificare a mano.
//
// Sono immagini di Supercell, prese dal CDN pubblico di Brawlify e
// ridimensionate a %dpx WebP. Incorporate e non collegate perche' la pagina
// pubblicata non carica immagini da altri siti: collegate non si vedrebbero,
// e senza nemmeno un errore.
//
// A cosa servono: riconoscere una faccia e' piu' veloce che leggere un nome,
// e qui il vincolo e' un timer di 22 secondi.
const BRAWLER_IMGS = {
%s
};
""" % (LATO, "\n".join(voci)))

# ---- Mappe -------------------------------------------------------------
# Piu' piccole dei ritratti come peso perche' a schermo si vedono in un
# riquadro stretto: 150px di larghezza bastano e si vede di che mappa si
# tratta, che e' tutto quello che serve per non sbagliare selezione.
mdir = os.path.join(src, "mappe")
mvoci, mtot = [], 0
if os.path.isdir(mdir) and os.path.exists(os.path.join(mdir, "nomi.tsv")):
    mnomi = {}
    with open(os.path.join(mdir, "nomi.tsv"), encoding="utf8") as f:
        for riga in f:
            i, n = riga.rstrip("\n").split("\t")
            mnomi[i] = n
    for ident in sorted(mnomi, key=lambda k: mnomi[k]):
        pth = os.path.join(mdir, f"{ident}.png")
        if not os.path.exists(pth):
            continue
        im = Image.open(pth).convert("RGB")
        im.thumbnail((150, 260), Image.LANCZOS)
        buf = io.BytesIO()
        im.save(buf, "WEBP", quality=72, method=6)
        b64 = base64.b64encode(buf.getvalue()).decode()
        mtot += len(b64)
        mvoci.append(f'  {json.dumps(mnomi[ident], ensure_ascii=False)}: "data:image/webp;base64,{b64}",')

with open(dest, "a", encoding="utf8") as f:
    f.write("""
// Immagini delle mappe del pool Classificata, stesse regole dei ritratti.
// La chiave e' "Modalita|Nome": due modalita' possono avere una mappa con lo
// stesso nome, e sono mappe diverse.
const MAP_IMGS = {
%s
};
""" % "\n".join(mvoci))

print(f"scritti {len(voci)} ritratti ({totale/1024:.0f} KB) e {len(mvoci)} mappe ({mtot/1024:.0f} KB) di base64", file=sys.stderr)
