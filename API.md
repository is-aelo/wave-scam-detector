flowchart LR
    C["Client (Next.js 16)"] --> POST["POST /api/scan"]
    POST --> RL["Rate Limit Check"]
    RL --> GEM["Gemini 3 Flash + Google Search"]
    GEM --> JSON["Structured JSON Response"]
    JSON --> C
    C --> RP["Result Panel with Sources"]