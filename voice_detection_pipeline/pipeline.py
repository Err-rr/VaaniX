"""
End-to-end: record from BlackHole -> save WAV -> run the detection model ->
save + print the verdict.

This is the only file meant to be run directly for a single end-to-end pass.
capture.py and model_runner.py are standalone and independently testable.

Usage:
    python pipeline.py
    VOICE_DETECTION_STUB=1 python pipeline.py   # test wiring without the real model
"""

import json
from datetime import datetime

from capture import record_sample
from model_runner import run_detection


def main() -> None:
    wav_path = record_sample()

    print(f"[pipeline] sending {wav_path.name} to the model...")
    result = run_detection(wav_path)

    result_with_meta = {
        **result,
        "wav_file": wav_path.name,
        "timestamp": datetime.now().isoformat(),
    }

    result_path = wav_path.with_suffix(".json")
    result_path.write_text(json.dumps(result_with_meta, indent=2))

    print(f"\n{'='*50}")
    print("VERDICT")
    print(f"{'='*50}")
    if result["stub"]:
        print("⚠️  STUB MODE — this score is random, not a real detection")
    icon = "🚨" if "SPOOF" in result["classification"] else "✅"
    print(f"{icon} {result['classification']}  (confidence: {result['confidence']:.2f}%)")
    print(f"    Real:  {result['real_prob']:.2f}%")
    print(f"    Spoof: {result['spoof_prob']:.2f}%")
    print(f"{'='*50}")
    print(f"Audio saved:  {wav_path}")
    print(f"Result saved: {result_path}")


if __name__ == "__main__":
    main()
