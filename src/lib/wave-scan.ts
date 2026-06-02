import {
  GoogleGenAI,
  HarmBlockThreshold,
  HarmCategory,
  Type,
} from "@google/genai";

export type WaveScanInput = {
  inputText: string;
  source?: string;
  url?: string;
  context?: string;
  evidence?: string;
};

export type WaveScanResult = {
  ok: true;
  rawText: string;
  parsed: unknown;
};

const responseSchema = {
  type: Type.OBJECT,
  required: [
    "mode",
    "language_style",
    "tone",
    "summary",
    "risk_score",
    "risk_level",
    "confidence",
    "scam_type",
    "red_flags",
    "what_could_happen",
    "recommendation",
  ],
  properties: {
    mode: {
      type: Type.STRING,
      enum: ["FREELANCER", "JOB_SEEKER", "MARKETPLACE", "URL_ANALYSIS", "REJECTED"],
    },
    language_style: {
      type: Type.STRING,
      enum: ["English", "Filipino", "Taglish"],
    },
    tone: {
      type: Type.STRING,
      enum: ["Formal", "Casual", "Warning"],
    },
    summary: {
      type: Type.STRING,
    },
    risk_score: {
      type: Type.NUMBER,
    },
    risk_level: {
      type: Type.STRING,
      enum: ["Safe", "Low Risk", "Caution", "Suspicious", "High Risk"],
    },
    confidence: {
      type: Type.NUMBER,
    },
    scam_type: {
      type: Type.STRING,
    },
    red_flags: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING,
      },
    },
    what_could_happen: {
      type: Type.STRING,
    },
    recommendation: {
      type: Type.STRING,
    },
  },
} as const;

function buildPrompt(
  inputText: string,
  source?: string,
  url?: string,
  context?: string,
  evidence?: string,
) {
  const analysisInstructions = url
    ? `Primary task: URL_ANALYSIS mode.
Focus on phishing links, malicious domains, suspicious URLs, redirect risk, and obvious trust signals.
Do not assume website content unless it is explicitly provided in the evidence.`
    : `Primary task: scam and fraud message analysis.
Focus on freelancer, job, marketplace, or other risky message patterns.`;

  return `You are "Wave", an AI-powered scam and risk detection assistant.

Analyze the user's input for scam or fraud risk only.

${analysisInstructions}

User Message:
${inputText}

Sender / Source:
${source ?? "None"}

URL:
${url ?? "None"}

Optional Context:
${context ?? "None"}

Optional Evidence:
${evidence ?? "None"}

Return JSON that matches the schema exactly.`;
}

export async function runWaveScan({
  inputText,
  source,
  url,
  context,
  evidence,
}: WaveScanInput): Promise<WaveScanResult> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY in environment.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        role: "user",
        parts: [
          {
            text: buildPrompt(inputText, source, url, context, evidence),
          },
        ],
      },
    ],
    config: {
      temperature: 0.2,
      topP: 0.9,
      maxOutputTokens: 1024,
      responseMimeType: "application/json",
      responseSchema,
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
        },
      ],
    },
  });

  const rawText = response.text ?? "";

  let parsed: unknown = null;
  if (rawText) {
    try {
      parsed = JSON.parse(rawText);
    } catch {
      parsed = null;
    }
  }

  return {
    ok: true,
    rawText,
    parsed,
  };
}
