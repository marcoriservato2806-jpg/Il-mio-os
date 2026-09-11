#!/usr/bin/env python3
"""Taglia un replay in fotogrammi leggibili.

Un video non lo so guardare: so leggere immagini. Questo lo trasforma
nell'altra cosa, in due passaggi, perche' leggere 200 fotogrammi uno per uno
costerebbe piu' di quanto rende.

  1. il provino    python3 script/replay-fotogrammi.py provino <video> [--ogni 4]
     Una sola immagine a griglia con un fotogramma ogni N secondi, l'istante
     stampato sopra ciascuno. Serve a trovare i momenti che contano.

  2. il momento    python3 script/replay-fotogrammi.py momento <video> 84.5 [--prima 3]
     I fotogrammi attorno a un istante, a piena risoluzione, uno ogni mezzo
     secondo. Il momento buono non e' quello della morte: e' qualche secondo
     prima, quando la scelta sbagliata e' stata fatta.
"""
import argparse, os, subprocess, sys, json
import imageio_ffmpeg

FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()
USCITA = os.environ.get("REPLAY_OUT", "/tmp/claude-0/replay")


def durata(video):
    # ffprobe non c'e': la durata si ricava facendo scorrere il file a vuoto.
    r = subprocess.run([FFMPEG, "-i", video, "-f", "null", "-"],
                       capture_output=True, text=True)
    ultimo = None
    for pezzo in r.stderr.split("time="):
        t = pezzo[:11].strip()
        if t and t[0].isdigit():
            ultimo = t
    if not ultimo:
        sys.exit("Non riesco a leggere la durata: il file e' un video?")
    h, m, s = ultimo.split(":")
    return int(h) * 3600 + int(m) * 60 + float(s)


def esegui(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        sys.exit("ffmpeg si e' fermato:\n" + r.stderr[-1200:])


def provino(video, ogni):
    d = durata(video)
    os.makedirs(USCITA, exist_ok=True)
    grezzi = os.path.join(USCITA, "grezzi")
    if os.path.isdir(grezzi):
        for f in os.listdir(grezzi):
            os.remove(os.path.join(grezzi, f))
    os.makedirs(grezzi, exist_ok=True)

    esegui([FFMPEG, "-y", "-i", video, "-vf", f"fps=1/{ogni},scale=360:-1",
            "-q:v", "3", os.path.join(grezzi, "f%03d.jpg")])
    files = sorted(os.listdir(grezzi))
    if not files:
        sys.exit("Nessun fotogramma estratto.")

    # L'istante va stampato su ogni riquadro: senza, un fotogramma interessante
    # non si sa dove ritrovarlo. Questa build di ffmpeg non ha il filtro
    # drawtext, quindi la griglia e le scritte le compone Pillow.
    from PIL import Image, ImageDraw, ImageFont
    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf", 22)
    except OSError:
        font = ImageFont.load_default()

    campione = Image.open(os.path.join(grezzi, files[0]))
    lc, ac = campione.size
    colonne = 5
    righe = (len(files) + colonne - 1) // colonne
    margine = 6
    foglio = Image.new("RGB",
                       (colonne * lc + (colonne + 1) * margine,
                        righe * ac + (righe + 1) * margine),
                       (18, 17, 27))
    disegna = ImageDraw.Draw(foglio)
    for i, nome in enumerate(files):
        im = Image.open(os.path.join(grezzi, nome)).convert("RGB")
        x = margine + (i % colonne) * (lc + margine)
        y = margine + (i // colonne) * (ac + margine)
        foglio.paste(im, (x, y))
        etichetta = f"{i * ogni:g}s"
        disegna.rectangle([x + 4, y + 4, x + 14 + 12 * len(etichetta), y + 32],
                          fill=(0, 0, 0))
        disegna.text((x + 9, y + 7), etichetta, fill=(255, 255, 255), font=font)

    fuori = os.path.join(USCITA, "provino.jpg")
    foglio.save(fuori, quality=88)
    print(json.dumps({"provino": fuori, "durata_s": round(d, 1),
                      "riquadri": len(files), "ogni_s": ogni,
                      "griglia": f"{colonne}x{righe}"}, indent=1))


def momento(video, istante, prima):
    inizio = max(0, istante - prima)
    os.makedirs(USCITA, exist_ok=True)
    cartella = os.path.join(USCITA, f"momento_{istante:.1f}".replace(".", "_"))
    os.makedirs(cartella, exist_ok=True)
    esegui([FFMPEG, "-y", "-ss", str(inizio), "-i", video,
            "-t", str(prima + 1), "-vf", "fps=2,scale=720:-1",
            "-q:v", "2", os.path.join(cartella, "f%02d.jpg")])
    files = sorted(os.listdir(cartella))
    print(json.dumps({"cartella": cartella, "da_s": round(inizio, 1),
                      "a_s": round(inizio + prima + 1, 1),
                      "fotogrammi": files}, indent=1))


p = argparse.ArgumentParser(description=__doc__,
                            formatter_class=argparse.RawDescriptionHelpFormatter)
sub = p.add_subparsers(dest="cosa", required=True)
a = sub.add_parser("provino"); a.add_argument("video"); a.add_argument("--ogni", type=float, default=4)
b = sub.add_parser("momento"); b.add_argument("video"); b.add_argument("istante", type=float)
b.add_argument("--prima", type=float, default=3)
args = p.parse_args()

if not os.path.exists(args.video):
    sys.exit(f"Non trovo il file: {args.video}")
if args.cosa == "provino":
    provino(args.video, args.ogni)
else:
    momento(args.video, args.istante, args.prima)
