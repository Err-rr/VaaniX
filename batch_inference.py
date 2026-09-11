import os
import glob
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

def main():
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Device: {device}")

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
    model_path = "wav2vec2_Nes2Net_X_best.pth"
    checkpoint = torch.load(model_path, map_location=device)
    model.load_state_dict(checkpoint)
    model.eval()
    print("Model successfully loaded.\n")

    # Collect files to test
    audios_dir = "/Users/1dit/Downloads/audios"
    audios_folder_files = sorted(glob.glob(os.path.join(audios_dir, "*.*")))
    
    other_files = [
        "/Users/1dit/Downloads/vandit.m4a",
        "/Users/1dit/Downloads/vandit fake.mp3",
        "/Users/1dit/Downloads/vandit_fake.wav",
        "/Users/1dit/Downloads/4.wav",
        "/Users/1dit/Downloads/Amitabh-bachchan-2026-09-06-01-53-Hi-this-is-team-3-am-debuggers-at-SIH-and-i-am-a.mp3"
    ]

    all_files = []
    for f in audios_folder_files + other_files:
        if os.path.exists(f) and f not in [x['path'] for x in all_files]:
            all_files.append({
                'name': os.path.basename(f),
                'path': f,
                'source': 'Downloads/audios/' if f in audios_folder_files else 'Downloads/'
            })

    results = []

    print(f"Starting batch evaluation on {len(all_files)} audio files...\n")

    with torch.no_grad():
        for item in all_files:
            file_path = item['path']
            filename = item['name']
            source_folder = item['source']

            try:
                audio, sr = librosa.load(file_path, sr=16000, mono=True)
                duration = len(audio) / sr
                x = torch.tensor(audio, dtype=torch.float32).unsqueeze(0).to(device)
                
                logits = model(x)
                probs = F.softmax(logits, dim=1).squeeze(0)

                # ASVspoof / Nes2Net dataset target convention:
                # Index 0 = SPOOF (Fake)
                # Index 1 = BONAFIDE (Real)
                spoof_logit = logits[0, 0].item()
                real_logit = logits[0, 1].item()
                spoof_prob = probs[0].item() * 100
                real_prob = probs[1].item() * 100

                classification = "SPOOF / DEEPFAKE" if spoof_prob > 50.0 else "REAL / BONAFIDE"
                confidence = spoof_prob if spoof_prob > 50.0 else real_prob

                res = {
                    'filename': filename,
                    'source': source_folder,
                    'duration': f"{duration:.2f}s",
                    'real_logit': f"{real_logit:.4f}",
                    'spoof_logit': f"{spoof_logit:.4f}",
                    'real_prob': f"{real_prob:.2f}%",
                    'spoof_prob': f"{spoof_prob:.2f}%",
                    'classification': classification,
                    'confidence': f"{confidence:.2f}%"
                }
                results.append(res)
                print(f"Processed: [{source_folder}] {filename} -> {classification} ({confidence:.2f}%)")
            except Exception as e:
                print(f"Error processing {filename}: {e}")

    # Generate Markdown Report
    md_content = "# Comprehensive Nes2Net Audio Deepfake Detection Results\n\n"
    md_content += f"**Total Audio Files Tested**: {len(results)}\n"
    md_content += f"**Model Checkpoint**: `wav2vec2_Nes2Net_X_best.pth`\n"
    md_content += f"**Foundation Model**: Wav2Vec 2.0 XLSR-300M (`xlsr2_300m.pt`)\n"
    md_content += f"**Label Convention**: Index 0 = SPOOF / DEEPFAKE, Index 1 = BONAFIDE / REAL\n\n"

    md_content += "## 📁 1. `~/Downloads/audios/` Dataset Results (8 Benchmark Audio Files)\n\n"
    md_content += "| Audio File | Duration | Real Logit | Spoof Logit | Real Prob | Spoof Prob | Classification | Confidence |\n"
    md_content += "| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n"

    for r in results:
        if r['source'] == 'Downloads/audios/':
            icon = "🚨" if "SPOOF" in r['classification'] else "✅"
            md_content += f"| `{r['filename']}` | {r['duration']} | {r['real_logit']} | {r['spoof_logit']} | {r['real_prob']} | {r['spoof_prob']} | {icon} **{r['classification']}** | **{r['confidence']}** |\n"

    md_content += "\n---\n\n"
    md_content += "## 🎵 2. Individual Downloads Audio Files Results\n\n"
    md_content += "| Audio File | Duration | Real Logit | Spoof Logit | Real Prob | Spoof Prob | Classification | Confidence |\n"
    md_content += "| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n"

    for r in results:
        if r['source'] == 'Downloads/':
            icon = "🚨" if "SPOOF" in r['classification'] else "✅"
            md_content += f"| `{r['filename']}` | {r['duration']} | {r['real_logit']} | {r['spoof_logit']} | {r['real_prob']} | {r['spoof_prob']} | {icon} **{r['classification']}** | **{r['confidence']}** |\n"

    out_md_path = "/Users/1dit/sih model/Nes2Net_ASVspoof_ITW/all_audio_test_results.md"
    with open(out_md_path, "w") as f:
        f.write(md_content)

    print(f"\n✅ All corrected results successfully saved to: {out_md_path}")

if __name__ == '__main__':
    main()
