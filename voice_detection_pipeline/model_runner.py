"""
Loads the Nes2Net deepfake-detection model once and exposes run_detection().

Mirrors the loading pattern in run_audio_inference.py / batch_inference.py
(the reference scripts committed alongside this pipeline) rather than
reinventing it — same import path, same DummyArgs shape, same checkpoint
filenames, same label convention. If those reference scripts change, bring
the changes here too.

Label convention (per WORKFLOW_GUIDE.md):
    logits[:, 0] = SPOOF / DEEPFAKE
    logits[:, 1] = BONAFIDE / REAL

Requires, none of which exist in this repo yet — see README.md:
    - model_scripts/wav2vec2_Nes2Net_X.py   (the model architecture)
    - xlsr2_300m.pt                          (~3.8 GB, wav2vec2 front-end)
    - wav2vec2_Nes2Net_X_best.pth            (~1.2 GB, trained back-end)
    - fairseq installed under Python 3.10

Set VOICE_DETECTION_STUB=1 to bypass all of the above and get a random score
instead — useful for testing the capture -> save -> score -> report pipeline
before the real model is wired in.
"""

import os
import random
from pathlib import Path
from typing import TypedDict

MODEL_DIR = Path(__file__).parent
XLSR_CHECKPOINT = MODEL_DIR / "xlsr2_300m.pt"
NES2NET_CHECKPOINT = MODEL_DIR / "wav2vec2_Nes2Net_X_best.pth"

STUB_MODE = os.environ.get("VOICE_DETECTION_STUB", "").lower() in ("1", "true")


class DetectionResult(TypedDict):
    classification: str   # "SPOOF / DEEPFAKE" or "REAL / BONAFIDE"
    confidence: float     # 0-100, confidence in `classification`
    real_prob: float      # 0-100
    spoof_prob: float     # 0-100
    real_logit: float
    spoof_logit: float
    stub: bool            # True if this came from the stub, not the real model


class DummyArgs:
    """Matches batch_inference.py's DummyArgs — the model constructor expects
    an argparse-like object with these fields, not a dict."""
    n_output_logits = 2
    model_name = "wav2vec2_Nes2Net_X"
    dilation = 2
    pool_func = "mean"
    SE_ratio = [1]
    Nes_ratio = [8, 8]


class VoiceDetector:
    """Loads model weights once; call .detect() as many times as you want.

    Do not instantiate this per-call — the wav2vec2 front-end alone is a
    300M-parameter model, and reloading it per sample would add several
    seconds of dead time to every single detection.
    """

    def __init__(self) -> None:
        self._model = None
        self._device = None

    def _ensure_loaded(self) -> None:
        if self._model is not None:
            return

        missing = []
        if not (MODEL_DIR / "model_scripts").is_dir():
            missing.append("model_scripts/wav2vec2_Nes2Net_X.py (model architecture code)")
        if not XLSR_CHECKPOINT.exists():
            missing.append(f"{XLSR_CHECKPOINT.name} (~3.8 GB, wav2vec2 front-end)")
        if not NES2NET_CHECKPOINT.exists():
            missing.append(f"{NES2NET_CHECKPOINT.name} (~1.2 GB, trained back-end)")
        if missing:
            raise RuntimeError(
                "Cannot load the real model — missing:\n  - "
                + "\n  - ".join(missing)
                + "\n\nSee README.md for where each of these comes from, or set "
                "VOICE_DETECTION_STUB=1 to test the pipeline without the real model."
            )

        import torch
        from model_scripts.wav2vec2_Nes2Net_X import wav2vec2_Nes2Net_no_Res_w_allT as Model

        self._device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        print(f"[model_runner] loading Nes2Net on {self._device} (this can take a while)...")

        model = Model(DummyArgs(), self._device).to(self._device)
        checkpoint = torch.load(NES2NET_CHECKPOINT, map_location=self._device)
        model.load_state_dict(checkpoint)
        model.eval()

        self._model = model
        print("[model_runner] model loaded, ready for inference")

    def detect(self, wav_path: Path) -> DetectionResult:
        """Run detection on one WAV file. Loads the model on first call only."""
        if STUB_MODE:
            return self._detect_stub()

        self._ensure_loaded()

        import torch
        import torch.nn.functional as F
        import librosa

        # librosa resamples to 16kHz here regardless of the file's native
        # rate, so capture.py's 48kHz BlackHole recording needs no
        # pre-processing before it gets here.
        audio, _sr = librosa.load(str(wav_path), sr=16000, mono=True)
        x = torch.tensor(audio, dtype=torch.float32).unsqueeze(0).to(self._device)

        with torch.no_grad():
            logits = self._model(x)  # shape [1, 2]
            probs = F.softmax(logits, dim=1).squeeze(0)

        spoof_logit = logits[0, 0].item()
        real_logit = logits[0, 1].item()
        spoof_prob = probs[0].item() * 100
        real_prob = probs[1].item() * 100

        is_spoof = spoof_prob > 50.0
        return {
            "classification": "SPOOF / DEEPFAKE" if is_spoof else "REAL / BONAFIDE",
            "confidence": spoof_prob if is_spoof else real_prob,
            "real_prob": real_prob,
            "spoof_prob": spoof_prob,
            "real_logit": real_logit,
            "spoof_logit": spoof_logit,
            "stub": False,
        }

    def _detect_stub(self) -> DetectionResult:
        spoof_prob = random.uniform(0, 100)
        real_prob = 100 - spoof_prob
        is_spoof = spoof_prob > 50.0
        print("[model_runner] STUB MODE — this is a random score, not a real detection")
        return {
            "classification": "SPOOF / DEEPFAKE" if is_spoof else "REAL / BONAFIDE",
            "confidence": spoof_prob if is_spoof else real_prob,
            "real_prob": real_prob,
            "spoof_prob": spoof_prob,
            "real_logit": float("nan"),
            "spoof_logit": float("nan"),
            "stub": True,
        }


# Module-level singleton so pipeline.py (and anything else) shares one loaded
# model instead of each accidentally creating its own.
_detector: VoiceDetector | None = None


def run_detection(wav_path: Path) -> DetectionResult:
    """Convenience entry point. Loads the model on first call, reuses it after."""
    global _detector
    if _detector is None:
        _detector = VoiceDetector()
    return _detector.detect(wav_path)
