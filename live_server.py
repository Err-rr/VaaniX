import os
import io
import torch
import numpy as np
import torch.nn.functional as F
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI(
    title="Nes2Net Real-Time Speech Anti-Spoofing & Deepfake Detection API",
    description="Live streaming WebSocket backend for audio deepfake detection using Nes2Net-X",
    version="1.0.0"
)

# Enable CORS for Next.js frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

class DummyArgs:
    n_output_logits = 2
    model_name = 'wav2vec2_Nes2Net_X'
    dilation = 2
    pool_func = 'mean'
    SE_ratio = [1]
    Nes_ratio = [8, 8]

# Initialize model
from model_scripts.wav2vec2_Nes2Net_X import wav2vec2_Nes2Net_no_Res_w_allT as Model
model = Model(DummyArgs(), device).to(device)
model_path = "wav2vec2_Nes2Net_X_best.pth"

if os.path.exists(model_path):
    checkpoint = torch.load(model_path, map_location=device)
    model.load_state_dict(checkpoint)
    model.eval()
    print(f"✅ Nes2Net model successfully loaded from {model_path} on device: {device}")
else:
    print(f"⚠️ Warning: Checkpoint {model_path} not found in root directory!")

def pad(x, max_len=64000):
    """Pad or truncate numpy waveform array to exactly max_len samples."""
    x_len = len(x)
    if x_len >= max_len:
        return x[-max_len:]
    num_repeats = int(max_len / x_len) + 1
    padded_x = np.tile(x, (1, num_repeats))[:, :max_len][0]
    return padded_x

@app.get("/api/health")
async def health_check():
    """Health check endpoint to verify backend service and model status."""
    return {
        "status": "ok",
        "service": "Nes2Net Live Streaming Backend",
        "model": "wav2vec2_Nes2Net_X",
        "device": str(device),
        "target_sample_rate": 16000
    }

@app.websocket("/ws/live-detection")
async def websocket_live_detection(websocket: WebSocket):
    """
    WebSocket endpoint for real-time live microphone stream analysis.
    Accepts raw Float32 PCM audio buffers (16 kHz mono) from client,
    maintains a rolling 4-second sliding buffer (64,000 samples), and returns
    live probabilities and deepfake classification.
    """
    await websocket.accept()
    print("🔌 Live WebSocket client connected")
    
    audio_buffer = np.array([], dtype=np.float32)
    WINDOW_SIZE = 64000  # 4 seconds at 16,000 Hz

    try:
        while True:
            # Receive incoming binary PCM bytes from frontend mic
            data = await websocket.receive_bytes()
            
            # Interpret incoming raw byte stream as 32-bit float PCM array
            chunk = np.frombuffer(data, dtype=np.float32)
            if len(chunk) == 0:
                continue

            audio_buffer = np.append(audio_buffer, chunk)

            # Maintain a rolling sliding window buffer of max 4 seconds (64,000 samples)
            if len(audio_buffer) > WINDOW_SIZE:
                audio_buffer = audio_buffer[-WINDOW_SIZE:]

            # Perform inference if we have accumulated at least 0.5s of audio (8,000 samples)
            if len(audio_buffer) >= 8000:
                padded_waveform = pad(audio_buffer, WINDOW_SIZE)
                tensor_input = torch.tensor(padded_waveform, dtype=torch.float32).unsqueeze(0).to(device)

                with torch.no_grad():
                    logits = model(tensor_input)
                    probs = F.softmax(logits, dim=1).squeeze(0)

                # Correct Label Mapping Convention:
                # Index 0 = SPOOF / DEEPFAKE
                # Index 1 = BONAFIDE / REAL
                spoof_prob = float(probs[0].item() * 100)
                real_prob = float(probs[1].item() * 100)
                spoof_score = float(logits[0, 0].item())
                real_score = float(logits[0, 1].item())

                is_deepfake = spoof_prob > 50.0
                classification = "SPOOF / DEEPFAKE" if is_deepfake else "REAL / BONAFIDE"
                confidence = spoof_prob if is_deepfake else real_prob

                # Send real-time classification result back to frontend UI
                await websocket.send_json({
                    "spoof_prob": round(spoof_prob, 2),
                    "real_prob": round(real_prob, 2),
                    "spoof_logit": round(spoof_score, 4),
                    "real_logit": round(real_score, 4),
                    "classification": classification,
                    "confidence": round(confidence, 2),
                    "risk_score": round(spoof_prob, 1),
                    "is_deepfake": is_deepfake,
                    "buffer_duration_sec": round(len(audio_buffer) / 16000.0, 2)
                })

    except WebSocketDisconnect:
        print("🔌 Live WebSocket client disconnected")
    except Exception as e:
        print(f"⚠️ Error in live detection stream: {e}")
        try:
            await websocket.close()
        except Exception:
            pass

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    print(f"🚀 Starting Nes2Net FastAPI Live Detection Server on port {port}...")
    uvicorn.run("live_server:app", host="0.0.0.0", port=port, reload=False)
