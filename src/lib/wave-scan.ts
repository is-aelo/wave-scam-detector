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

Only set mode to "REJECTED" if the input is a pure greeting, casual chit-chat, or completely unrelated to any scam or fraud scenario (e.g. "Hi", "Hello", "How are you?", "What's the weather?"). For REJECTED inputs, assign appropriate values for all fields reflecting that no scam analysis was performed (e.g. risk_level indicating safety, risk_score and confidence at near-zero, and a summary explaining the input was not a scam scenario). Do not use REJECTED for any input that could be scam or fraud related, even if it appears safe.

Keep summary, what_could_happen, and recommendation concise — no more than 2 sentences each.

You MUST always return valid JSON that matches the schema exactly — never return plain text.`;
}

async function runMockScan({
  inputText,
  url,
}: WaveScanInput): Promise<WaveScanResult> {
  await mockDelay();
  const result = mockResult(inputText, url);
  const rawText = JSON.stringify(result);
  return { ok: true, rawText, parsed: result };
}

function mockDelay(): Promise<void> {
  return new Promise((r) => setTimeout(r, 800 + Math.random() * 1200));
}

function mockResult(inputText: string, url?: string) {
  const text = inputText.toLowerCase();

  if (text.includes("hello") || text.includes("hi ") || text.includes("how are you") || text.includes("what is the weather")) {
    return {
      mode: "REJECTED",
      language_style: "English",
      tone: "Casual",
      summary: "This doesn't appear to be a scam-related message. Wave is designed to analyze messages and URLs for scam or fraud risk. Please share a suspicious message or link for analysis.",
      risk_score: 0,
      risk_level: "Safe",
      confidence: 0,
      scam_type: "N/A",
      red_flags: [],
      what_could_happen: "N/A",
      recommendation: "No action needed — this input is outside Wave's scam-detection scope.",
    };
  }

  if (url) {
    const isPhishing = text.includes("bit.ly") || text.includes("tinyurl") || text.includes("login") || text.includes("secure") || text.includes("verify") || text.includes("paypal");
    if (isPhishing) {
      return {
        mode: "URL_ANALYSIS",
        language_style: "English",
        tone: "Warning",
        summary: "This URL exhibits strong phishing indicators. The domain uses a deceptive subdomain structure and a shortened redirect chain typical of credential harvesting campaigns.",
        risk_score: 85,
        risk_level: "High Risk",
        confidence: 0.92,
        scam_type: "Phishing Link",
        red_flags: [
          "Suspicious subdomain mimicking a legitimate brand",
          "URL shortener masking the final destination",
          "Contains security-adjacent keywords (verify, secure, login)",
          "No HTTPS or misconfigured TLS certificate",
        ],
        what_could_happen: "Clicking this link could redirect to a credential harvesting page that captures your email, password, or financial details. Malware delivery through drive-by downloads is also possible.",
        recommendation: "Do not click the link. Delete the message. If it claims to be from a service you use, navigate to that service's official website directly (not via the link) and verify.",
      };
    }
    return {
      mode: "URL_ANALYSIS",
      language_style: "English",
      tone: "Formal",
      summary: "The URL appears legitimate. No phishing indicators, redirect chains, or suspicious domain patterns were detected.",
      risk_score: 5,
      risk_level: "Safe",
      confidence: 0.87,
      scam_type: "N/A",
      red_flags: [],
      what_could_happen: "Minimal risk. Standard browsing safety practices still apply.",
      recommendation: "The link appears safe, but always verify you're on the official domain before entering sensitive information.",
    };
  }

  const isScam = text.includes("pay") || text.includes("money") || text.includes("gcash") || text.includes("bank") || text.includes("send") || text.includes("transfer") || text.includes("win") || text.includes("prize") || text.includes("urgent") || text.includes("password");
  if (isScam) {
    return {
      mode: "FREELANCER",
      language_style: "Taglish",
      tone: "Casual",
      summary: "This message shows multiple scam indicators including unsolicited payment requests, urgency tactics, and requests for financial information.",
      risk_score: 78,
      risk_level: "Suspicious",
      confidence: 0.88,
      scam_type: "Advance Fee Scam",
      red_flags: [
        "Requests upfront payment or processing fee",
        "Urgency or limited-time pressure tactic",
        "Vague company details and unverifiable claims",
        "Payment via untraceable method (GCash, wire transfer)",
      ],
      what_could_happen: "Victims may lose the upfront payment and never receive the promised goods or services. Personal information shared could be used for identity theft.",
      recommendation: "Do not send any money or personal information. Block the sender. Report the message to the platform where you received it.",
    };
  }

  return {
    mode: "JOB_SEEKER",
    language_style: "English",
    tone: "Formal",
    summary: "The message appears to be a legitimate communication. No clear scam patterns detected, but remain cautious as the sender was not verified.",
    risk_score: 15,
    risk_level: "Low Risk",
    confidence: 0.65,
    scam_type: "N/A",
    red_flags: [],
    what_could_happen: "Low risk. Standard caution is advised when dealing with unverified senders.",
    recommendation: "No immediate action needed. If this is a job offer, verify the company independently before sharing any personal information.",
  };
}

export async function runWaveScan({
  inputText,
  source,
  url,
  context,
  evidence,
}: WaveScanInput): Promise<WaveScanResult> {
  if (process.env.MOCK_SCAN === "true") {
    return runMockScan({ inputText, source, url, context, evidence });
  }

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
      maxOutputTokens: 8192,
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

  const rawText = response.text;

  let rawJson: string;
  let parsed: unknown;

  if (typeof rawText === "string") {
    rawJson = rawText;
    try {
      parsed = JSON.parse(rawText);
    } catch {
      throw new Error("The AI returned an unreadable response. Please try again.");
    }
    if (typeof parsed !== "object" || parsed === null) {
      throw new Error("The AI response was not in the expected format.");
    }
  } else if (rawText && typeof rawText === "object") {
    parsed = rawText;
    rawJson = JSON.stringify(rawText);
  } else {
    throw new Error("The AI returned an empty response. Please try again.");
  }

  return {
    ok: true,
    rawText: rawJson,
    parsed,
  };
}
