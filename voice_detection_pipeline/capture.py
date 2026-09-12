"""
Record a fixed-length audio sample from BlackHole and save it to disk.

Standalone: this module has no dependency on model_runner.py and can be
tested on its own. Ported from live_capture/test_capture.py, which is where
the BlackHole routing + macOS microphone-permission issues were worked out.
"""

import os
from datetime import datetime
from pathlib import Path

import numpy as np
import sounddevice as sd
import soundfile as sf

# Index of the virtual audio device to capture from — BlackHole 2ch on macOS,
# VB-Cable on Windows. This differs per machine and per OS, so it's an env
# var rather than hardcoded: find yours with
#   python -c "import sounddevice as sd; print(sd.query_devices())"
# and set AUDIO_DEVICE_INDEX, or just edit the "0" default below if you only
# ever run this on one machine. Re-check after reinstalling the driver or
# rebooting — indices can shift.
DEVICE_INDEX = int(os.environ.get("AUDIO_DEVICE_INDEX", "0"))

SAMPLE_RATE = 48000       # BlackHole's native rate. The model resamples to
                          # 16kHz itself at load time (librosa.load(sr=16000)),
                          # so no resampling happens in this file.
WAIT_BEFORE_SECONDS = 5   # dead time before the sample window starts
DURATION_SECONDS = 10     # actual sample length handed to the model

RESULTS_DIR = Path(__file__).parent / "results"


def record_sample(
    wait_before_seconds: int = WAIT_BEFORE_SECONDS,
    duration_seconds: int = DURATION_SECONDS,
    device_index: int = DEVICE_INDEX,
    output_dir: Path = RESULTS_DIR,
) -> Path:
    """Wait, then record `duration_seconds` from BlackHole. Returns the WAV path.

    The caller must ensure audio is actually flowing into BlackHole for the
    full (wait_before_seconds + duration_seconds) window — this function does
    not know or care what the audio source is (a call, a video, a test tone).
    """
    output_dir.mkdir(parents=True, exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    destination = output_dir / f"sample_{timestamp}.wav"

    print(f"[capture] recording starts in {wait_before_seconds}s "
          f"(device {device_index}, {duration_seconds}s window)")
    for remaining in range(wait_before_seconds, 0, -1):
        print(f"[capture]   {remaining}s...")
        sd.sleep(1000)

    print(f"[capture] recording now for {duration_seconds}s")
    recording = sd.rec(
        int(duration_seconds * SAMPLE_RATE),
        samplerate=SAMPLE_RATE,
        channels=2,
        device=device_index,
        dtype="float32",
    )
    sd.wait()

    peak = float(np.abs(recording).max())
    if peak < 0.001:
        print("[capture] WARNING: recorded audio is silent (peak "
              f"{peak:.6f}). Check BlackHole is selected as system output "
              "and something was actually playing during the window.")

    sf.write(destination, recording, SAMPLE_RATE)
    print(f"[capture] saved {destination} (peak amplitude {peak:.4f})")
    return destination


if __name__ == "__main__":
    record_sample()
