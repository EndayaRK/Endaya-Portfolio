import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const envPath = path.join(rootDir, ".env");

// 1. Load .env file
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  for (const line of envContent.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const match = trimmed.match(/^([^=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const val = match[2].trim().replace(/^['"]|['"]$/g, "");
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
}

const apiKey = process.env.GEMINI_API_KEY;

console.log("\n==================================================");
console.log("       ✦ Rhon's Portfolio AI Verification ✦       ");
console.log("==================================================\n");

if (!apiKey) {
  console.error("❌ ERROR: GEMINI_API_KEY is missing!");
  console.error("   Please open .env and set your GEMINI_API_KEY before running this script.\n");
  process.exit(1);
}

const maskedKey =
  apiKey.length > 8
    ? `${apiKey.slice(0, 4)}...${apiKey.slice(-4)}`
    : "***";
console.log(`🔑 API Key Found: ${maskedKey}`);

// 2. Query definition
const customPrompt = process.argv.slice(2).join(" ");
const testQuery =
  customPrompt ||
  "What is Rhon's primary tech stack and is he available for an IT internship?";

console.log(`💬 Test Question: "${testQuery}"\n`);
console.log("⏳ Connecting to Google Gemini API...");

const ai = new GoogleGenAI({ apiKey });

const systemInstruction = `You are the portfolio assistant for Rhon Kelly Endaya, a 4th-year BS Information Technology student at De La Salle Lipa specializing in System Development.
Tech Stack: React, TypeScript, Node.js, Express.js, PHP, PostgreSQL, MongoDB, Prisma.
Projects: Full-stack applications, barangay community platforms, and automotive inventory management.
Status: Actively seeking software development / IT internship opportunities in Lipa City, Batangas, or remote.
Tone: Crisp, professional, welcoming, and concise. Answer visitor questions in 1-3 sentences and suggest checking the relevant portfolio section.`;

// Candidate lightweight Flash-Lite models in order of priority
const CANDIDATE_MODELS = [
  "gemini-3.5-flash-lite",
  "gemini-flash-lite-latest",
];

let success = false;

for (const model of CANDIDATE_MODELS) {
  try {
    process.stdout.write(`🤖 Testing model [${model}]... `);
    const startTime = Date.now();

    const response = await ai.models.generateContent({
      model,
      contents: testQuery,
      config: {
        temperature: 0.3,
        maxOutputTokens: 300,
        systemInstruction,
      },
    });

    const duration = Date.now() - startTime;
    console.log(`✅ SUCCESS! (${duration}ms)\n`);
    console.log("------------------ AI Response ------------------");
    console.log(response.text?.trim());
    console.log("-------------------------------------------------\n");
    console.log(`🎉 Model [${model}] is active and responding beautifully!\n`);
    success = true;
    break;
  } catch (err) {
    const errorMsg = err?.message || String(err);
    console.log(`❌ Failed (${errorMsg.slice(0, 80)}...)`);
  }
}

if (!success) {
  console.error("\n❌ ERROR: None of the candidate models succeeded. Please verify your API key permissions.\n");
  process.exit(1);
}
