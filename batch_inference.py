import os
import glob
import torch
import torch.nn.functional as F
import librosa
import numpy as np

import argparse

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

def main():
    parser = argparse.ArgumentParser(description="Nes2Net Batch Audio Deepfake Detection")
    parser.add_argument("--input_dir", type=str, default=None, help="Directory containing audio files")
    parser.add_argument("--model_path", type=str, default="wav2vec2_Nes2Net_X_best.pth", help="Model checkpoint path")
    parser.add_argument("--output_report", type=str, default="all_audio_test_results.md", help="Markdown output report path")
    cli_args = parser.parse_args()

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Device: {device}")

    ensure_checkpoints_exist(model_path=cli_args.model_path)

    from model_scripts.wav2vec2_Nes2Net_X import wav2vec2_Nes2Net_no_Res_w_allT as Model

    class DummyArgs:
        n_output_logits = 2
        model_name = 'wav2vec2_Nes2Net_X'
        dilation = 2
        pool_func = 'mean'
        SE_ratio = [1]
        Nes_ratio = [8, 8]

    args = DummyArgs()
    model = Model(args, device).to(device)
    model_path = cli_args.model_path
    checkpoint = torch.load(model_path, map_location=device)
    model.load_state_dict(checkpoint)
    model.eval()
    print("Model successfully loaded.\n")

    # Collect files to test
    audio_extensions = ["*.wav", "*.mp3", "*.m4a", "*.flac", "*.aac", "*.ogg"]
    search_dirs = []
    if cli_args.input_dir:
        search_dirs.append(cli_args.input_dir)
    else:
        user_downloads = os.path.expanduser("~/Downloads/audios")
        if os.path.exists(user_downloads):
            search_dirs.append(user_downloads)
        search_dirs.append("./")

    found_files = []
    for d in search_dirs:
        for ext in audio_extensions:
            found_files.extend(glob.glob(os.path.join(d, ext)))

    all_files = []
    for f in sorted(found_files):
        if os.path.exists(f) and f not in [x['path'] for x in all_files]:
            all_files.append({
                'name': os.path.basename(f),
                'path': f,
                'source': os.path.dirname(f) or './'
            })

    if not all_files:
        print("⚠️ No audio files found to process.")
        return

    results = []

    with torch.no_grad():
        for item in all_files:
            filepath = item['path']
            filename = item['name']
            source_folder = item['source']

            try:
                audio, sr = librosa.load(filepath, sr=16000, mono=True)
                duration_sec = len(audio) / sr
                audio_padded = pad(audio, 64000)

                x = torch.tensor(audio_padded, dtype=torch.float32).unsqueeze(0).to(device)
                logits = model(x)
                probs = F.softmax(logits, dim=1).squeeze(0)

                bonafide_score = logits[0, 0].item()
                spoof_score = logits[0, 1].item()
                real_prob = probs[0].item() * 100
                spoof_prob = probs[1].item() * 100

                classification = "SPOOF / DEEPFAKE" if spoof_prob > 50.0 else "REAL / BONAFIDE"
                confidence = spoof_prob if spoof_prob > 50.0 else real_prob

                results.append({
                    'filename': filename,
                    'duration': f"{duration_sec:.2f}s",
                    'real_logit': f"{bonafide_score:+.4f}",
                    'spoof_logit': f"{spoof_score:+.4f}",
                    'real_prob': f"{real_prob:.2f}%",
                    'spoof_prob': f"{spoof_prob:.2f}%",
                    'classification': classification,
                    'confidence': f"{confidence:.2f}%",
                    'source': source_folder
                })
                print(f"Processed: [{source_folder}] {filename} -> {classification} ({confidence:.2f}%)")
            except Exception as e:
                print(f"Error processing {filename}: {e}")

    # Generate Markdown Report
    md_content = "# Comprehensive Nes2Net Audio Deepfake Detection Results\n\n"
    md_content += f"**Total Audio Files Tested**: {len(results)}\n"
    md_content += f"**Model Checkpoint**: `{cli_args.model_path}`\n"
    md_content += f"**Foundation Model**: Wav2Vec 2.0 XLSR-300M (`xlsr2_300m.pt`)\n"
    md_content += f"**Label Convention**: Index 0 = SPOOF / DEEPFAKE, Index 1 = BONAFIDE / REAL\n\n"

    md_content += "## 🎵 Batch Audio Classification Results\n\n"
    md_content += "| Audio File | Duration | Real Logit | Spoof Logit | Real Prob | Spoof Prob | Classification | Confidence |\n"
    md_content += "| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n"

    for r in results:
        icon = "🚨" if "SPOOF" in r['classification'] else "✅"
        md_content += f"| `{r['filename']}` | {r['duration']} | {r['real_logit']} | {r['spoof_logit']} | {r['real_prob']} | {r['spoof_prob']} | {icon} **{r['classification']}** | **{r['confidence']}** |\n"

    out_md_path = cli_args.output_report
    with open(out_md_path, "w") as f:
        f.write(md_content)

    print(f"\n✅ All batch test results successfully saved to: {out_md_path}")

if __name__ == '__main__':
    main()
