import argparse
import os
# pyrefly: ignore [missing-import]
import torch
import torch.nn.functional as F
import librosa
import numpy as np

def pad(x, max_len=64000):
    x_len = x.shape[0]
    if x_len >= max_len:
        return x[:max_len]
    num_repeats = int(max_len / x_len) + 1
    padded_x = np.tile(x, (1, num_repeats))[:, :max_len][0]
    return padded_x

def ensure_checkpoints_exist(model_path="wav2vec2_Nes2Net_X_best.pth", xlsr_path="xlsr2_300m.pt"):
    import urllib.request
    if not os.path.exists(xlsr_path):
        print(f"📥 Missing XLSR foundation model weights: {xlsr_path}")
        print(f"Downloading Meta Wav2Vec 2.0 XLSR 300M (~3.8 GB)...")
        try:
            url = "https://dl.fbaipublicfiles.com/fairseq/wav2vec/xlsr2_300m.pt"
            urllib.request.urlretrieve(url, xlsr_path)
            print(f"✅ XLSR 300M model downloaded successfully: {xlsr_path}\n")
        except Exception as e:
            print(f"⚠️ Automatic download failed: {e}")
            print(f"Please run: aria2c -x 16 -s 16 https://dl.fbaipublicfiles.com/fairseq/wav2vec/xlsr2_300m.pt")
            raise FileNotFoundError(f"Missing foundation model checkpoint: {xlsr_path}")

    if not os.path.exists(model_path):
        print(f"📥 Missing Nes2Net model checkpoint: {model_path}")
        print(f"Downloading pre-trained Nes2Net checkpoint (~1.2 GB)...")
        try:
            import gdown
            gdown.download(id='1JFGv_2TONMnTLGbiOIuHFfMvuo4SIIpg', output=model_path, resume=True)
            print(f"✅ Nes2Net checkpoint downloaded successfully: {model_path}\n")
        except Exception as e:
            print(f"⚠️ Automatic download failed: {e}")
            print(f"Please run: python -c \"import gdown; gdown.download(id='1JFGv_2TONMnTLGbiOIuHFfMvuo4SIIpg', output='{model_path}', resume=True)\"")
            raise FileNotFoundError(f"Missing Nes2Net checkpoint: {model_path}")

def main(args):
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"\n==================================================")
    print(f"🔥 Nes2Net Speech Anti-Spoofing & Deepfake Inference")
    print(f"==================================================")
    print(f"Device: {device}")
    print(f"Audio File: {args.file_to_test}")
    print(f"Checkpoint: {args.model_path}\n")

    if not os.path.exists(args.file_to_test):
        raise FileNotFoundError(f"Audio file not found: {args.file_to_test}")

    ensure_checkpoints_exist(model_path=args.model_path)

    from model_scripts.wav2vec2_Nes2Net_X import wav2vec2_Nes2Net_no_Res_w_allT as Model

    # Create model
    model = Model(args, device).to(device)

    # Load weights
    checkpoint = torch.load(args.model_path, map_location=device)
    model.load_state_dict(checkpoint)
    print(f"✅ Model weights successfully loaded from: {args.model_path}\n")

    model.eval()

    with torch.no_grad():
        # Load audio using librosa at 16kHz
        audio, sr = librosa.load(args.file_to_test, sr=16000, mono=True)
        duration = len(audio) / sr
        print(f"Loaded audio duration: {duration:.2f} seconds ({len(audio)} samples at {sr} Hz)")

        if args.test_mode == '4s':
            audio = pad(audio, 64000)

        x = torch.tensor(audio, dtype=torch.float32).unsqueeze(0).to(device)

        # Forward pass
        logits = model(x) # shape [1, 2]
        probs = F.softmax(logits, dim=1).squeeze(0)

        spoof_score = logits[0, 0].item()
        bonafide_score = logits[0, 1].item()
        
        spoof_prob = probs[0].item() * 100
        real_prob = probs[1].item() * 100

        print(f"\n--------------------------------------------------")
        print(f"📊 INFERENCE RESULTS")
        print(f"--------------------------------------------------")
        print(f"Raw Logits  -> Bonafide (Real): {bonafide_score:+.4f}  |  Spoof (Fake): {spoof_score:+.4f}")
        print(f"Probability -> Real Voice:      {real_prob:.2f}%")
        print(f"Probability -> Spoof/Deepfake:  {spoof_prob:.2f}%")
        print(f"--------------------------------------------------")

        if spoof_prob > 50.0:
            print(f"🚨 CLASSIFICATION: SPOOF / DEEPFAKE AUDIO (Confidence: {spoof_prob:.2f}%)")
        else:
            print(f"✅ CLASSIFICATION: REAL / BONAFIDE AUDIO (Confidence: {real_prob:.2f}%)")
        print(f"==================================================\n")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Nes2Net Audio Deepfake Detection Inference")
    parser.add_argument("--n_output_logits", type=int, default=2)
    parser.add_argument('--model_name', type=str, default='wav2vec2_Nes2Net_X')
    parser.add_argument("--dilation", type=int, default=2)
    parser.add_argument("--pool_func", type=str, default='mean', choices=['mean', 'ASTP'])
    parser.add_argument("--SE_ratio", type=int, nargs='+', default=[1])
    parser.add_argument("--Nes_ratio", type=int, nargs='+', default=[8, 8])
    parser.add_argument("--file_to_test", type=str, required=True, help="Path to audio file")
    parser.add_argument("--model_path", type=str, default="wav2vec2_Nes2Net_X_best.pth", help="Path to model checkpoint")
    parser.add_argument("--test_mode", type=str, default='full', choices=['4s', 'full'])

    args = parser.parse_args()
    main(args)
