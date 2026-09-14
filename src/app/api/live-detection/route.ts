import { NextRequest, NextResponse } from "next/server";

/** voice_detection_pipeline/server.py — see that folder's README for how to start it. */
const MODEL_SERVER_URL = process.env.VOICE_DETECTION_SERVER_URL ?? "http://127.0.0.1:8765";

const UNREACHABLE_MESSAGE =
  "Detection engine unreachable. Start it with `python server.py` in voice_detection_pipeline/.";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const audio = formData.get("audio");
  if (!(audio instanceof Blob)) {
    return NextResponse.json({ error: "Missing 'audio' chunk in request" }, { status: 400 });
  }

  const upstreamForm = new FormData();
  upstreamForm.append("audio", audio, "chunk.wav");

  let upstreamResponse: Response;
  try {
    upstreamResponse = await fetch(`${MODEL_SERVER_URL}/detect`, {
      method: "POST",
      body: upstreamForm,
    });
  } catch {
    return NextResponse.json({ error: UNREACHABLE_MESSAGE }, { status: 503 });
  }

  const data = await upstreamResponse.json().catch(() => null);
  if (!upstreamResponse.ok || !data) {
    return NextResponse.json(
      { error: data?.error ?? "Detection failed" },
      { status: upstreamResponse.status || 502 }
    );
  }

  return NextResponse.json(data);
}

export async function GET() {
  try {
    const res = await fetch(`${MODEL_SERVER_URL}/health`, { cache: "no-store" });
    if (!res.ok) throw new Error("not ok");
    return NextResponse.json(await res.json());
  } catch {
    return NextResponse.json({ status: "offline" }, { status: 503 });
  }
}
