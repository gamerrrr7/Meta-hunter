import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Set up server-side parsers
app.use(express.json());

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
} else {
  console.warn("WARNING: GEMINI_API_KEY is not defined. AI Assistant will operate in fallback mock mode.");
}

// 1. API Route: Server-side Gemini AI Chat Proxy
app.post("/api/gemini/chat", async (req, res) => {
  try {
    const { message, history } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: "Missing 'message' in request body." });
    }

    if (!ai) {
      // Return beautiful fallback mock response if API Key is not set yet
      return res.json({
        text: `[FALLBACK MODE] Olá! Notamos que o a chave GEMINI_API_KEY não foi configurada nos segredos ainda de sua aplicação. Mas como seu assistente, posso te dar essa dica:\n\n**Como alcançar sua meta mais rápido?**\n1. Defina um valor realístico para começar.\n2. Revise seus gastos supérfluos mensais.\n3. Programe uma transferência automática logo no dia do pagamento.\n\n*Aviso Comercial: Esta simulação educativa não constitui aconselhamento financeiro oficial.*`
      });
    }

    const systemInstruction = 
      "You are 'Hunter AI' (or 'Hunter AI Assistente'), a friendly, expert financial planner assistant for the 'Caçador de Metas' app. " +
      "Your purpose is to explain financial concepts (like compound interest, inflation, saving rates, budgeting, emergency fund size), " +
      "help users outline practical saving plans, recommend realistic goal strategies, and provide high-quality motivation.\n\n" +
      "CRITICAL RULE 1: Never provide professional investment advice or asset management. You are only an educational guide.\n" +
      "CRITICAL RULE 2: You must always language-match the user. If they write in Portuguese, answer in premium Portuguese. If they write in English, answer in English.\n" +
      "CRITICAL RULE 3: Always finalize your response with this standard disclaimer text in the appropriate language:\n" +
      "In Portuguese: 'Aviso: Hunter AI é um recurso educativo de planejamento. Suas simulações e ideias não substituem conselho profissional ou assessoria de investimentos autorizada.'\n" +
      "In English: 'Disclaimer: Hunter AI is an educational planning resource. Its simulations and strategies do not replace professional advice or authorized investment assistance.'";

    // Format chat contents for the new @google/genai SDK format
    // Ref: Contents can be structured as history
    const formattedContents = [...(history || [])];
    formattedContents.push({ role: 'user', parts: [{ text: message }] });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: formattedContents,
      config: {
        systemInstruction,
        temperature: 1.0,
      }
    });

    return res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini Proxy Error:", error);
    return res.status(500).json({ 
      error: "Ocorreu um erro ao chamar a inteligência artificial.", 
      details: error.message || String(error)
    });
  }
});

// App Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// 2. Vite Middleware or Static Assets Setup
async function initializeServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in DEVELOPMENT mode with Vite Middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in PRODUCTION mode serving static files...");
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Caçador de Metas server is booted on port ${PORT}!`);
  });
}

initializeServer().catch(err => {
  console.error("Failed to start Caçador de Metas server:", err);
});
