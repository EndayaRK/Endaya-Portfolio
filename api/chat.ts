import { GoogleGenAI } from "@google/genai";

// Vercel Serverless Function & Edge compatible request/response types
interface VercelRequest {
  method?: string;
  body?: any;
  headers?: Record<string, string | string[] | undefined>;
  json?: () => Promise<any>;
}

interface VercelResponse {
  status: (code: number) => VercelResponse;
  json: (data: any) => void;
  setHeader: (name: string, value: string) => VercelResponse;
  end: (data?: any) => void;
}

const SYSTEM_INSTRUCTION = `You are the portfolio assistant for Rhon Kelly Endaya, a 4th-year BS Information Technology student at De La Salle Lipa specializing in System Development.
Tech Stack: React, TypeScript, Node.js, Express.js, PHP, PostgreSQL, MongoDB, Prisma.
Projects: Full-stack applications, barangay community platforms, and automotive inventory management.
Status: Actively seeking software development / IT internship opportunities in Lipa City, Batangas, or remote.
Tone: Crisp, professional, welcoming, and concise. Answer visitor questions in 1-3 sentences and suggest checking the relevant portfolio section.`;

function sendResponse(res: VercelResponse | undefined, status: number, data: any) {
  if (res && typeof res.status === "function" && typeof res.json === "function") {
    res.setHeader?.("Content-Type", "application/json");
    res.setHeader?.("Access-Control-Allow-Origin", "*");
    return res.status(status).json(data);
  }

  // Web Standard Response fallback (Vercel Edge / Web Runtime)
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

export default async function handler(req: VercelRequest, res?: VercelResponse) {
  // CORS Preflight
  if (req.method === "OPTIONS") {
    if (res?.status) {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type");
      return res.status(200).end();
    }
    return new Response(null, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  // Enforce POST method
  if (req.method && req.method !== "POST") {
    return sendResponse(res, 405, {
      error: "Method Not Allowed. Please send a POST request.",
    });
  }

  // Validate Gemini API Key
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return sendResponse(res, 500, {
      error:
        "GEMINI_API_KEY is not configured on the server. Please add your Gemini API key to your environment variables.",
    });
  }

  // Parse request body for both Node & Web runtimes
  let userQuery = "";
  try {
    if (req.body) {
      if (typeof req.body === "string") {
        const parsed = JSON.parse(req.body);
        userQuery = parsed.message || parsed.query || "";
      } else {
        userQuery = req.body.message || req.body.query || "";
      }
    } else if (typeof req.json === "function") {
      const parsed = await req.json();
      userQuery = parsed?.message || parsed?.query || "";
    }
  } catch (parseError) {
    return sendResponse(res, 400, {
      error: "Invalid JSON payload in request body.",
    });
  }

  // Validate payload
  if (!userQuery || typeof userQuery !== "string" || !userQuery.trim()) {
    return sendResponse(res, 400, {
      error: "Missing or empty 'message' field in request body.",
    });
  }

  const trimmedQuery = userQuery.trim();

  // Initialize official @google/genai SDK
  const ai = new GoogleGenAI({ apiKey });

  // Targeted lightweight model with fallback
  const PRIMARY_MODEL = "gemini-2.5-flash-lite";
  const FALLBACK_MODEL = "gemini-1.5-flash-8b";

  try {
    // Attempt Primary lightweight model: gemini-2.5-flash-lite
    const response = await ai.models.generateContent({
      model: PRIMARY_MODEL,
      contents: trimmedQuery,
      config: {
        temperature: 0.3,
        maxOutputTokens: 300,
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });

    const reply = response.text || "";
    return sendResponse(res, 200, {
      reply,
      model: PRIMARY_MODEL,
    });
  } catch (primaryError: any) {
    console.warn(
      `Primary model [${PRIMARY_MODEL}] failed. Attempting fallback [${FALLBACK_MODEL}]:`,
      primaryError?.message || primaryError
    );

    try {
      // Fallback model: gemini-1.5-flash-8b
      const fallbackResponse = await ai.models.generateContent({
        model: FALLBACK_MODEL,
        contents: trimmedQuery,
        config: {
          temperature: 0.3,
          maxOutputTokens: 300,
          systemInstruction: SYSTEM_INSTRUCTION,
        },
      });

      const fallbackReply = fallbackResponse.text || "";
      return sendResponse(res, 200, {
        reply: fallbackReply,
        model: FALLBACK_MODEL,
      });
    } catch (fallbackError: any) {
      console.error("Gemini API Error across both models:", fallbackError);
      return sendResponse(res, 502, {
        error:
          fallbackError?.message ||
          "Failed to receive a response from the Gemini AI service. Please try again shortly.",
      });
    }
  }
}

