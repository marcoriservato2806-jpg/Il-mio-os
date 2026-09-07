#!/usr/bin/env python3
"""Ridimensiona i ritratti scaricati e li scrive come data URI in ritratti.js.

Chiamato da script/fetch-ritratti.js, non a mano.
"""
import base64, io, os, sys
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
    voci.append(f'  {nomi[ident]!r}: "data:image/webp;base64,{b64}",'.replace("'", '"'))

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

print(f"scritti {len(voci)} ritratti, {totale/1024:.0f} KB di base64 in totale", file=sys.stderr)
