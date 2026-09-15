# ============================================================
# Production Dockerfile — Nes2Net FastAPI WebSocket Backend
# Optimized for Render (CPU, model weights downloaded at boot)
# ============================================================
FROM python:3.10-slim

WORKDIR /app

# System dependencies: ffmpeg for audio processing, git for s3prl
RUN apt-get update && apt-get install -y --no-install-recommends \
    libsndfile1 \
    ffmpeg \
    git \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies (CPU-only torch)
COPY requirements_render.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements_render.txt

# Copy application source code
COPY . .

# Expose port
EXPOSE 8000

ENV PORT=8000
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

# Startup: download model weights if absent, then launch uvicorn
CMD ["sh", "-c", "python download_weights.py && uvicorn live_server:app --host 0.0.0.0 --port ${PORT:-8000}"]
