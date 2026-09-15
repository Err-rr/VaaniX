# Voice Detection Pipeline

Two ways to use this folder's model:

- **`pipeline.py`** — record from a virtual audio device → save → detect →
  print. A local, one-shot CLI tool. No frontend, no API.
- **`server.py`** — a small Flask API (`/health`, `/detect`) around the same
  model, kept loaded once. This is what the Next.js app's Live Detection
  page (browser mic → `/api/live-detection` → this server) actually talks
  to.

```
python pipeline.py
    capture.py: record_sample()   →  results/sample_<timestamp>.wav
    model_runner.py: run_detection()  →  results/sample_<timestamp>.json + printed verdict
```

**Status: confirmed working end to end on macOS**, via `pipeline.py`. The
Windows steps below are written from the same logic but have not been run
on an actual Windows machine yet. The Render deployment below has not been
deployed yet either — the config is written and ready, but nobody has
clicked "Create Blueprint" and watched it actually come up. If something
breaks in either case, paste the exact error and it gets fixed the same way
the macOS issues were.

---

## Folder structure

```
voice_detection_pipeline/
├── pipeline.py                     ⭐ RUN THIS — capture → save → detect → report
├── capture.py                        Records from a virtual audio device (standalone, testable alone)
├── model_runner.py                    Loads Nes2Net ONCE, exposes run_detection()
├── model_scripts/
│   └── wav2vec2_Nes2Net_X.py            The architecture — only file model_runner.py imports
├── xlsr2_300m.pt                          Front-end weights (~3.8 GB)
├── wav2vec2_Nes2Net_X_best.pth              Back-end weights (~1.2 GB)
├── requirements.txt                          Deps for this folder's own venv
├── .venv/                                     This folder's Python 3.10 environment
└── results/                                    Runtime output: WAVs + verdict JSONs
```

Nothing here is training or evaluation code — this folder only runs
inference on one recording at a time. (Everything else that came from the
original model repo — training scripts, benchmark/EER scripts, alternate
architectures — was deliberately removed after confirming, import by
import, that `pipeline.py` never touches any of it. It's still recoverable
from git history if ever needed: `git show bdf13ba:main.py`, etc.)

---

## How audio actually gets in

Neither macOS nor Windows lets a Python script directly "listen to what a
call or video is playing." Both need a **virtual audio device** — a fake
sound card that a real device's output gets copied into, so a program can
read it as if it were a microphone. macOS calls this a Core Audio driver;
Windows calls it an audio driver too, just a different implementation.

| | macOS | Windows |
|---|---|---|
| Virtual device | BlackHole (free) | VB-Cable (free) |
| Where it sits in Settings | Sound → Output | Sound → Output |
| To also hear the audio yourself | Create a Multi-Output Device (Audio MIDI Setup) | Windows has no built-in equivalent — see note below |

**Hearing the audio yourself while it's being captured (optional, only
needed for a live call you're personally on, not for testing):**
- **macOS:** Audio MIDI Setup → **+** → Create Multi-Output Device → tick
  both the virtual device and your speakers.
- **Windows:** no native equivalent. VB-Cable's paid sibling ("VB-Cable A+B"
  or "Voicemeeter", also free) can split output to two destinations. For
  testing without a live call, you don't need this at all — just route a
  video or music player's output straight into the virtual device.

---

## Setup — macOS

**Step 1:** Install BlackHole.
```
brew install blackhole-2ch
sudo killall coreaudiod
```
→ If macOS says a restart is required (it sometimes does on newer versions),
restart before continuing.

**Step 2:** Grant microphone permission — the single most common silent
failure in this whole setup. macOS returns all-zero audio with no error at
all if this is skipped.
- **System Settings → Privacy & Security → Microphone**
- Enable **Terminal** (or **Visual Studio Code**, whichever you run this from)
- ⚠️ Fully quit and reopen that app after enabling — the permission does not
  apply to an already-running process.

**Step 3:** Set your Mac's audio output to BlackHole.
**System Settings → Sound → Output → BlackHole 2ch**

**Step 4:** Install Python 3.10 — required specifically for `fairseq` compatibility.
```
brew install python@3.10
```

**Step 5:** Create this folder's own venv, using 3.10 explicitly.
```
cd /Users/devanshkedia/VoxAegis/voice_detection_pipeline
python3.10 -m venv .venv
source .venv/bin/activate
```

**Step 6:** Install everything except `fairseq`.
```
pip install --upgrade pip
pip install -r requirements.txt
```
→ ⚠️ If `omegaconf==2.0.6` fails with an "invalid metadata" error, pip is
being stricter than this old package's metadata allows:
```
pip install "pip<24.1"
pip install -r requirements.txt
```

**Step 7:** Install `fairseq` separately, without letting it pull in
conflicting dependency versions.
```
pip install --no-deps git+https://github.com/facebookresearch/fairseq.git
```
→ Confirmed working with `fairseq==0.12.2` on macOS + Apple Silicon.

**Step 8:** Download both checkpoints into this folder. ⚠️ ~5 GB total —
check `df -h` first.
```
brew install aria2
aria2c -x 16 -s 16 https://dl.fbaipublicfiles.com/fairseq/wav2vec/xlsr2_300m.pt
```
```
pip install gdown
python -c "import gdown; gdown.download(id='1JFGv_2TONMnTLGbiOIuHFfMvuo4SIIpg', output='wav2vec2_Nes2Net_X_best.pth', resume=True)"
```

**Step 9:** Confirm the import chain works.
```
python -c "from model_runner import run_detection; print('imports ok')"
```
→ This only proves the Python files parse — it doesn't load the model yet
(that's lazy, on first real call). Run `pipeline.py` for the real test.

**Step 10:** Find your BlackHole device index (should be `0` if it's the
only virtual device installed, but confirm):
```
python -c "import sounddevice as sd; print(sd.query_devices())"
```
Look for `BlackHole 2ch` and note the number on its left. If it isn't `0`:
```
export AUDIO_DEVICE_INDEX=<the number>
```

---

## Setup — Windows

Run these in **PowerShell**, not Command Prompt.

**Step 1:** Install VB-Cable — search "VB-CABLE Virtual Audio Device" on
[vb-audio.com](https://vb-audio.com/Cable/), download, run the installer as
Administrator. **Restart your laptop afterward** — this driver does not
reliably activate without a reboot.

**Step 2:** Grant microphone permission — same class of silent-failure risk
as on macOS.
- **Settings → Privacy & Security → Microphone**
- Turn on **"Let apps access your microphone"**
- Scroll down and enable it specifically for **Terminal** / **Windows
  Terminal** / **Visual Studio Code**, whichever you run this from

**Step 3:** Set your audio output to the VB-Cable input.
**Settings → System → Sound → Output → CABLE Input (VB-Audio Virtual Cable)**

**Step 4:** Install Python 3.10.
```
winget install Python.Python.3.10
```
→ If `winget` isn't recognized, download the installer directly from
[python.org/downloads](https://www.python.org/downloads/release/python-3100/)
instead — during install, tick **"Add python.exe to PATH."**

**Step 5:** Install the Visual C++ Build Tools. `fairseq` compiles small C
extensions during install, and Windows has no compiler by default —
without this, Step 8 below fails with an error mentioning `cl.exe` or
`Microsoft Visual C++ 14.0 or greater is required`.
```
winget install Microsoft.VisualStudio.2022.BuildTools
```
→ When the installer opens, select the **"Desktop development with C++"**
workload, then install. This step is large (a few GB) and can take a while.

**Step 6:** Create this folder's own venv, using 3.10 explicitly.
```
cd C:\path\to\VoxAegis\voice_detection_pipeline
py -3.10 -m venv .venv
.venv\Scripts\Activate.ps1
```
→ ⚠️ If PowerShell refuses with a script-execution error, run this once
first, then retry activation:
```
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

**Step 7:** Install everything except `fairseq`.
```
pip install --upgrade pip
pip install -r requirements.txt
```
→ Same `omegaconf` metadata issue can appear here too:
```
pip install "pip<24.1"
pip install -r requirements.txt
```

**Step 8:** Install `fairseq`.
```
pip install --no-deps git+https://github.com/facebookresearch/fairseq.git
```
→ ⚠️ Untested on Windows. If it fails on a compiler error, that means Step 5
didn't fully take — restart PowerShell (a fresh terminal picks up the new
build tools) and retry before assuming something else is wrong.

**Step 9:** Download both checkpoints into this folder. ⚠️ ~5 GB total.
```
winget install aria2.aria2
aria2c -x 16 -s 16 https://dl.fbaipublicfiles.com/fairseq/wav2vec/xlsr2_300m.pt
```
```
pip install gdown
python -c "import gdown; gdown.download(id='1JFGv_2TONMnTLGbiOIuHFfMvuo4SIIpg', output='wav2vec2_Nes2Net_X_best.pth', resume=True)"
```

**Step 10:** Confirm the import chain works.
```
python -c "from model_runner import run_detection; print('imports ok')"
```

**Step 11:** Find the VB-Cable device index — it will almost certainly
**not** be `0`.
```
python -c "import sounddevice as sd; print(sd.query_devices())"
```
Look for `CABLE Output (VB-Audio Virtual Cable)` and note the number:
```
$env:AUDIO_DEVICE_INDEX = "<the number>"
```
→ This only lasts the current PowerShell session — set it again each time
you open a new terminal, or add it to your PowerShell profile.

---

## Running it

**For real**, once Setup is complete (either OS):
```
python pipeline.py
```

Before running: confirm the virtual device is selected as system output,
and have something playing — a video, music, a call — for the full
15-second window (5s wait + 10s recording).

**Testing without the real model** — verifies capture, saving, and the
report format, using a random score instead of a real detection:

macOS / Linux:
```
VOICE_DETECTION_STUB=1 python pipeline.py
```
Windows (PowerShell):
```
$env:VOICE_DETECTION_STUB = "1"; python pipeline.py
```
The printed verdict and saved JSON will clearly say `"stub": true` so you
never mistake a placeholder score for a real one.

---

## Running it as a live server (for the frontend's Live Detection page)

`pipeline.py` is a one-shot script — it records once, scores once, exits.
The Next.js app's **Live Detection** page needs the model to stay loaded and
answer many short requests in a row instead, so use `server.py`:

```
python server.py
VOICE_DETECTION_STUB=1 python server.py   # random scores, no weights needed
```

This starts an HTTP server on `http://127.0.0.1:8765` (override with
`VOICE_DETECTION_PORT`) that keeps `model_runner.py`'s model singleton loaded
across requests instead of reloading it every time. It exposes:

- `GET /health` → `{"status": "ok", "stub": <bool>}`
- `POST /detect` → form field `audio` (a WAV file) → the same JSON shape
  `pipeline.py` writes to `results/*.json`

The Next.js app's `src/app/api/live-detection/route.ts` proxies browser
requests to this server — the browser never talks to it directly, so it
only ever needs to be reachable from the machine running `next dev`/`next
start`. Leave this running in its own terminal while using the Live
Detection page; if it isn't running, the page will show a "detection engine
unreachable" error instead of a verdict.

---

## Output

Each run produces two files in `results/`:
- `sample_<timestamp>.wav` — the recorded audio
- `sample_<timestamp>.json` — the verdict, e.g.:
```json
{
  "classification": "REAL / BONAFIDE",
  "confidence": 97.42,
  "real_prob": 97.42,
  "spoof_prob": 2.58,
  "real_logit": 3.11,
  "spoof_logit": -2.04,
  "stub": false,
  "wav_file": "sample_20260911_223010.wav",
  "timestamp": "2026-09-11T22:30:25.109"
}
```

---

## Things worth knowing

- **`AUDIO_DEVICE_INDEX` is an env var, not a hardcoded value**, precisely
  because it differs by OS and by machine — BlackHole is usually `0` on a
  clean macOS install, VB-Cable is essentially never `0` on Windows. Always
  confirm with `sounddevice.query_devices()` on a new machine rather than
  assuming the default is right.
- **No resampling code exists in `capture.py` on purpose.** It records at
  the device's native 48kHz. `model_runner.py` calls `librosa.load(path,
  sr=16000)`, which resamples on read. Don't add a second resampling step.
- **The model loads once, not once per recording.** `model_runner.py` keeps
  a module-level singleton (`_detector`). Re-running `pipeline.py` as a
  fresh process reloads it each time — expected for a one-shot script.
- **Label convention is not index-0-is-real:** index 0 = SPOOF, index 1 =
  BONAFIDE/REAL. `model_runner.py` follows this — double-check if you ever
  touch that logic, since getting this backwards is a silent, not a loud, bug.
- **`fairseq` is installed with `--no-deps`**, so anything it imports at
  startup has to be listed in `requirements.txt` explicitly. `sacrebleu` is
  there for exactly this reason — `fairseq/__init__.py` eagerly imports a
  BLEU translation-scoring submodule that has nothing to do with audio
  detection, but still needs it to import cleanly. If a fresh install ever
  throws a new `ModuleNotFoundError` pointing inside `fairseq/`, that's the
  same pattern: `pip install <name>`, add it to `requirements.txt`.
- **`torch` in this venv is 2.x; the original model repo used 1.8.1.**
  Confirmed not to matter in practice — this pipeline has run the real
  model successfully on the newer version.

---

## Telegram alerts on a detected spoof

`pipeline_with_alerts.py` runs the exact same capture → detect flow as
`pipeline.py`, then sends a Telegram warning through the `telegram/` folder's
existing bot if the result is a real (non-stub) SPOOF classification.
`pipeline.py` itself is untouched — it still runs with zero Telegram
dependency, for anyone who just wants detection without alerting.

### Setup

**Step 1:** Get a bot token from **@BotFather** on Telegram, if you don't
already have one, and set it:
```
export TELEGRAM_BOT_TOKEN="your real token"
```
→ ⚠️ Never put this directly in `telegram/_client.py` — an earlier version
of this project did exactly that, the token ended up committed to git
history, and had to be rotated as a result. Environment variable only.

**Step 2:** Message **@Prevent_Scambot** on Telegram and send `/start` —
Telegram bots can only message users who have messaged them first.

**Step 3:** Find your chat_id.
```
cd ../telegram
python get_chat_id.py
```
→ Prints your name and chat_id from the `/start` message you just sent.

**Step 4:** Set it.
```
export TELEGRAM_CHAT_ID="the number from step 3"
```

**Step 5:** Run it.
```
cd ../voice_detection_pipeline
python pipeline_with_alerts.py
```

### What actually triggers an alert

| Result | Alert sent? |
|---|---|
| Real detection, REAL/BONAFIDE | No |
| Real detection, SPOOF/DEEPFAKE | **Yes** |
| Stub mode (`VOICE_DETECTION_STUB=1`), any result | No — stub scores are random, alerting on one would just be spam |
| SPOOF, but `TELEGRAM_CHAT_ID` unset | No — printed warning instead, detection still completes normally |
| SPOOF, but Telegram API call fails | No — printed warning instead, detection still completes normally |

The last two rows matter for the same reason `db.py` was built to fail
soft: a Telegram outage, or forgetting to set a chat_id, should never erase
a detection result you already have and already saved to disk.

### How the import across folders works

`alerts.py` lives in the sibling `telegram/` directory, and it does
`from _client import api_call` internally — a same-directory import that
only resolves if `telegram/` itself is on `sys.path`, not just the repo
root. `pipeline_with_alerts.py` inserts that path before importing `alerts`,
resolved from `Path(__file__).parent.parent / "telegram"` so it works
regardless of what directory you actually run the script from.
