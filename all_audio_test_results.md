# Comprehensive Nes2Net Audio Deepfake Detection Results

**Total Audio Files Tested**: 13
**Model Checkpoint**: `wav2vec2_Nes2Net_X_best.pth`
**Foundation Model**: Wav2Vec 2.0 XLSR-300M (`xlsr2_300m.pt`)
**Label Convention**: Index 0 = SPOOF / DEEPFAKE, Index 1 = BONAFIDE / REAL

## 📁 1. `~/Downloads/audios/` Dataset Results (8 Benchmark Audio Files)

| Audio File | Duration | Real Logit | Spoof Logit | Real Prob | Spoof Prob | Classification | Confidence |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `barack_obama_fake_23.9s.wav` | 23.88s | -3.1205 | 4.0289 | 0.08% | 99.92% | 🚨 **SPOOF / DEEPFAKE** | **99.92%** |
| `barack_obama_real_21.5s.wav` | 21.46s | 4.7959 | -3.4356 | 99.97% | 0.03% | ✅ **REAL / BONAFIDE** | **99.97%** |
| `donald_trump_fake_23.9s.wav` | 23.89s | -2.4563 | 2.9790 | 0.43% | 99.57% | 🚨 **SPOOF / DEEPFAKE** | **99.57%** |
| `donald_trump_real_23.8s.wav` | 23.80s | 1.7233 | -1.1268 | 94.53% | 5.47% | ✅ **REAL / BONAFIDE** | **94.53%** |
| `kanye_west_fake_21.5s.wav` | 21.54s | -3.7697 | 4.4925 | 0.03% | 99.97% | 🚨 **SPOOF / DEEPFAKE** | **99.97%** |
| `kanye_west_real_19.0s.wav` | 19.04s | 6.2211 | -4.5947 | 100.00% | 0.00% | ✅ **REAL / BONAFIDE** | **100.00%** |
| `mark_zuckerberg_fake_23.1s.wav` | 23.06s | -2.6718 | 3.2975 | 0.25% | 99.75% | 🚨 **SPOOF / DEEPFAKE** | **99.75%** |
| `mark_zuckerberg_real_23.5s.wav` | 23.49s | 3.6166 | -2.7128 | 99.82% | 0.18% | ✅ **REAL / BONAFIDE** | **99.82%** |

---

## 🎵 2. Individual Downloads Audio Files Results

| Audio File | Duration | Real Logit | Spoof Logit | Real Prob | Spoof Prob | Classification | Confidence |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `vandit.m4a` | 12.22s | 4.6190 | -2.9694 | 99.95% | 0.05% | ✅ **REAL / BONAFIDE** | **99.95%** |
| `vandit fake.mp3` | 12.36s | 4.5846 | -3.3064 | 99.96% | 0.04% | ✅ **REAL / BONAFIDE** | **99.96%** |
| `vandit_fake.wav` | 12.36s | 4.5885 | -3.3072 | 99.96% | 0.04% | ✅ **REAL / BONAFIDE** | **99.96%** |
| `4.wav` | 0.99s | 4.6850 | -3.6906 | 99.98% | 0.02% | ✅ **REAL / BONAFIDE** | **99.98%** |
| `Amitabh-bachchan-2026-09-06-01-53-Hi-this-is-team-3-am-debuggers-at-SIH-and-i-am-a.mp3` | 6.43s | 3.8014 | -2.8308 | 99.87% | 0.13% | ✅ **REAL / BONAFIDE** | **99.87%** |
