import { runWaveScan } from "@/lib/wave-scan";

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as
      | {
          input_text?: string;
          source?: string;
          url?: string;
          context?: string;
          evidence?: string;
        }
      | null;

    const inputText = body?.input_text?.trim() ?? "";
    const source = body?.source?.trim();
    const url = body?.url?.trim();
    const context = body?.context?.trim();
    const evidence = body?.evidence?.trim();

    if (!inputText) {
      return Response.json(
        { error: "`input_text` is required." },
        { status: 400 },
      );
    }

    const result = await runWaveScan({
      inputText,
      source,
      url,
      context,
      evidence,
    });

    return Response.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected server error.";

    return Response.json(
      {
        ok: false,
        error: message,
      },
      { status: 500 },
    );
  }
}
