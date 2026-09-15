#!/usr/bin/env python3
"""
download_weights.py
-------------------
Downloads Nes2Net model checkpoint and Wav2Vec2 XLSR-300M backbone weights
at container startup if they are not already present.

Called automatically by the Dockerfile CMD before uvicorn starts.
"""
import os
import sys
import urllib.request

XLSR_URL = "https://dl.fbaipublicfiles.com/fairseq/wav2vec/xlsr2_300m.pt"
XLSR_FILE = "xlsr2_300m.pt"
XLSR_SIZE_MB = 3630  # ~3.6 GB

NES2NET_GDRIVE_ID = "1JFGv_2TONMnTLGbiOIuHFfMvuo4SIIpg"
NES2NET_FILE = "wav2vec2_Nes2Net_X_best.pth"
NES2NET_SIZE_MB = 1213  # ~1.2 GB


def progress_hook(count, block_size, total_size):
    downloaded = count * block_size
    if total_size > 0:
        percent = min(downloaded * 100 / total_size, 100)
        mb = downloaded / (1024 * 1024)
        print(f"\r  → {mb:.1f} MB ({percent:.0f}%)", end="", flush=True)


def download_xlsr():
    if os.path.exists(XLSR_FILE) and os.path.getsize(XLSR_FILE) > 100_000_000:
        print(f"✅ {XLSR_FILE} already present — skipping download.")
        return
    print(f"📥 Downloading Wav2Vec2 XLSR-300M from Meta AI (~{XLSR_SIZE_MB} MB)...")
    try:
        urllib.request.urlretrieve(XLSR_URL, XLSR_FILE, reporthook=progress_hook)
        print(f"\n✅ Downloaded {XLSR_FILE}")
    except Exception as e:
        print(f"\n❌ Failed to download {XLSR_FILE}: {e}")
        sys.exit(1)


def download_nes2net():
    if os.path.exists(NES2NET_FILE) and os.path.getsize(NES2NET_FILE) > 100_000_000:
        print(f"✅ {NES2NET_FILE} already present — skipping download.")
        return
    print(f"📥 Downloading Nes2Net checkpoint from Google Drive (~{NES2NET_SIZE_MB} MB)...")
    try:
        import gdown
        gdown.download(id=NES2NET_GDRIVE_ID, output=NES2NET_FILE, quiet=False)
        if not os.path.exists(NES2NET_FILE) or os.path.getsize(NES2NET_FILE) < 100_000_000:
            raise RuntimeError("Download incomplete or failed.")
        print(f"✅ Downloaded {NES2NET_FILE}")
    except Exception as e:
        print(f"❌ Failed to download {NES2NET_FILE}: {e}")
        print("   Set env var NES2NET_WEIGHTS_URL to a direct download URL as fallback.")
        fallback_url = os.environ.get("NES2NET_WEIGHTS_URL")
        if fallback_url:
            print(f"   Trying fallback URL: {fallback_url}")
            try:
                urllib.request.urlretrieve(fallback_url, NES2NET_FILE, reporthook=progress_hook)
                print(f"\n✅ Downloaded {NES2NET_FILE} via fallback URL.")
            except Exception as e2:
                print(f"\n❌ Fallback also failed: {e2}")
                sys.exit(1)
        else:
            sys.exit(1)


if __name__ == "__main__":
    print("=" * 60)
    print("  VoxAegis — Model Weight Download")
    print("=" * 60)
    download_xlsr()
    download_nes2net()
    print("\n🚀 All weights ready. Starting server...")
