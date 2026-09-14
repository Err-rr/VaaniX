"""
Small persistent HTTP server around model_runner.run_detection(), so the
Next.js "Live Detection" page can get real-time verdicts without paying the
cost of loading the ~5GB model on every request. model_runner.py already
keeps a module-level singleton (see `_detector`) — this server just keeps
that singleton alive across requests by staying a long-running process.

Run inside this folder's venv (same one set up per README.md):
    python server.py
    VOICE_DETECTION_STUB=1 python server.py   # random scores, no real model needed

Listens on 127.0.0.1:8765 by default — override with VOICE_DETECTION_PORT.
The Next.js app talks to this via src/app/api/live-detection/route.ts, which
proxies from the browser so this server never needs to be exposed beyond
localhost.

Endpoints:
    GET  /health   -> {"status": "ok", "stub": <bool>}
    POST /detect   -> multipart form field "audio" (a WAV file) -> DetectionResult JSON
"""

import os
import tempfile
from pathlib import Path

from flask import Flask, jsonify, request

from model_runner import STUB_MODE, run_detection

app = Flask(__name__)

PORT = int(os.environ.get("VOICE_DETECTION_PORT", "8765"))


@app.get("/health")
def health():
    return jsonify({"status": "ok", "stub": STUB_MODE})


@app.post("/detect")
def detect():
    audio = request.files.get("audio")
    if audio is None:
        return jsonify({"error": "Missing 'audio' file in form data"}), 400

    with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp:
        audio.save(tmp.name)
        tmp_path = Path(tmp.name)

    try:
        result = run_detection(tmp_path)
    except Exception as exc:
        # Most likely the model weights aren't downloaded yet — see README.md.
        return jsonify({"error": str(exc)}), 500
    finally:
        tmp_path.unlink(missing_ok=True)

    return jsonify(result)


if __name__ == "__main__":
    print(f"[server] starting on http://127.0.0.1:{PORT} (stub={STUB_MODE})")
    print("[server] the model loads lazily on the first /detect call, not now")
    # threaded=False on purpose: VoiceDetector holds one model instance, and
    # concurrent requests into the same torch model isn't something this
    # pipeline has been set up (or needs) to support — a single browser tab
    # streaming chunks one at a time is the only expected caller.
    app.run(host="127.0.0.1", port=PORT, threaded=False)
