# Comprehensive Nes2Net Audio Deepfake Detection Results

**Total Audio Files Tested**: 14
**Model Checkpoint**: `wav2vec2_Nes2Net_X_best.pth`
**Foundation Model**: Wav2Vec 2.0 XLSR-300M (`xlsr2_300m.pt`)
**Label Convention**: Index 0 = SPOOF / DEEPFAKE, Index 1 = BONAFIDE / REAL

## 🎵 Batch Audio Classification Results

| Audio File | Duration | Real Logit | Spoof Logit | Real Prob | Spoof Prob | Classification | Confidence |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `4.wav` | 0.99s | -2.0169 | +1.9880 | 1.79% | 98.21% | 🚨 **SPOOF / DEEPFAKE** | **98.21%** |
| `Amitabh-bachchan-2026-09-06-01-53-Hi-this-is-team-3-am-debuggers-at-SIH-and-i-am-a.mp3` | 6.43s | +3.0553 | -2.2435 | 99.50% | 0.50% | ✅ **REAL / BONAFIDE** | **99.50%** |
| `barack_obama_fake_23.9s.wav` | 23.88s | -2.9614 | +3.3314 | 0.18% | 99.82% | 🚨 **SPOOF / DEEPFAKE** | **99.82%** |
| `barack_obama_real_21.5s.wav` | 21.46s | +6.2287 | -4.6321 | 100.00% | 0.00% | ✅ **REAL / BONAFIDE** | **100.00%** |
| `donald_trump_fake_23.9s.wav` | 23.89s | -2.5019 | +2.5149 | 0.66% | 99.34% | 🚨 **SPOOF / DEEPFAKE** | **99.34%** |
| `donald_trump_real_23.8s.wav` | 23.80s | +4.8269 | -3.5806 | 99.98% | 0.02% | ✅ **REAL / BONAFIDE** | **99.98%** |
| `kanye_west_fake_21.5s.wav` | 21.54s | -3.2866 | +3.5499 | 0.11% | 99.89% | 🚨 **SPOOF / DEEPFAKE** | **99.89%** |
| `kanye_west_real_19.0s.wav` | 19.04s | +4.7298 | -3.5535 | 99.97% | 0.03% | ✅ **REAL / BONAFIDE** | **99.97%** |
| `mark_zuckerberg_fake_23.1s.wav` | 23.06s | -3.0654 | +3.3706 | 0.16% | 99.84% | 🚨 **SPOOF / DEEPFAKE** | **99.84%** |
| `mark_zuckerberg_real_23.5s.wav` | 23.49s | +5.2803 | -4.0457 | 99.99% | 0.01% | ✅ **REAL / BONAFIDE** | **99.99%** |
| `vandit fake.mp3` | 12.36s | +5.0887 | -3.7806 | 99.99% | 0.01% | ✅ **REAL / BONAFIDE** | **99.99%** |
| `vandit real test.m4a` | 23.29s | -3.0113 | +3.3194 | 0.18% | 99.82% | 🚨 **SPOOF / DEEPFAKE** | **99.82%** |
| `vandit.m4a` | 12.22s | +4.4546 | -2.8287 | 99.93% | 0.07% | ✅ **REAL / BONAFIDE** | **99.93%** |
| `vandit_fake.wav` | 12.36s | +5.0883 | -3.7835 | 99.99% | 0.01% | ✅ **REAL / BONAFIDE** | **99.99%** |
