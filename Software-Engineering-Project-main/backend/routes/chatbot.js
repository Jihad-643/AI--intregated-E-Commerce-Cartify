import express from "express";
import { getDB } from "../config/db.js";

const router = express.Router();

const getGroqApiKey = () => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GROQ_API_KEY is not configured on the server. Add it to backend/.env.",
    );
  }
  return apiKey;
};

const callGroq = async (combinedPrompt) => {
  const apiKey = getGroqApiKey();

  // Groq API Endpoint
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      // High performance & ultra-fast free model
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM_INSTRUCTION },
        { role: "user", content: combinedPrompt },
      ],
      // Enforce JSON output mode
      response_format: { type: "json_object" },
      temperature: 0.5,
      max_tokens: 1200,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `Groq API error ${response.status}: ${response.statusText} ${body}`,
    );
  }

  const data = await response.json();
  const choice = data?.choices?.[0];
  if (!choice) {
    throw new Error("Groq returned no choices.");
  }
  return choice.message?.content ?? choice.text ?? "";
};

// Build a compact, model-friendly summary of the catalog so the LLM has real data to ground answers on.
const buildCatalogSummary = (products) => {
  // Limit to first 80 products to keep prompts small; sort by in-stock first.
  const inStock = products.filter((p) => (p.quantity || 0) > 0);
  const sorted = [...inStock].sort(
    (a, b) => (b.quantity || 0) - (a.quantity || 0),
  );
  const sample = sorted.slice(0, 80);

  return sample.map((p) => ({
    id: p._id?.toString(),
    title: p.title,
    price: p.price,
    category: p.category,
    description: (p.description || "").slice(0, 140),
    stock: p.quantity,
  }));
};

const SYSTEM_INSTRUCTION = `You are Cartify AI, a friendly shopping assistant for the Cartify e-commerce website (prices are in Bangladeshi Taka / BDT).
Your ONLY job is to help the user with this website. You can:
- Recommend products from the catalog I provide.
- Filter by budget (e.g. "under 1000 BDT"), category, or keywords from the title/description.
- Answer basic questions about the site (categories available, how to order, contact, account, returns, shipping).
- Politely refuse anything unrelated to shopping on this site.

You MUST respond with a strict JSON object (no markdown fences, no commentary outside the JSON). The JSON shape is:
{
  "reply": "A short, conversational, friendly message to the user (max ~80 words).",
  "recommendations": [
    {
      "id": "<product id from the catalog>",
      "title": "<product title>",
      "price": <number>,
      "reason": "<one short sentence why it fits the user's request>"
    }
  ]
}

Rules for "recommendations":
- Pick products ONLY from the catalog I provide. Never invent product ids.
- Pick 0 to 5 items. Order them by best match to the user's request.
- Strictly respect any budget the user mentions (e.g. "under 1000 BDT" means price <= 1000).
- If the user is not asking for product suggestions (just a general question), return an empty array.
- If nothing in the catalog matches, return [] and explain in "reply" that no products matched, and suggest relaxing the criteria.`;

router.post("/", async (req, res) => {
  try {
    const { message, history } = req.body || {};

    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        success: false,
        error: "A non-empty 'message' string is required.",
      });
    }

    // Fetch the catalog once per request.
    const db = await getDB();
    const products = await db
      .collection("products")
      .find({})
      .project({
        title: 1,
        price: 1,
        category: 1,
        description: 1,
        quantity: 1,
      })
      .toArray();

    const catalog = buildCatalogSummary(products);

    // Trim history to last 6 turns so the prompt stays small.
    const safeHistory = Array.isArray(history)
      ? history
          .filter(
            (m) =>
              m &&
              typeof m.content === "string" &&
              (m.role === "user" || m.role === "assistant"),
          )
          .slice(-6)
          .map((m) => ({ role: m.role, content: m.content.slice(0, 500) }))
      : [];

    const historyBlock = safeHistory.length
      ? safeHistory
          .map(
            (m) =>
              `${m.role === "assistant" ? "Assistant" : "User"}: ${m.content}`,
          )
          .join("\n")
      : "(no prior conversation)";

    const combinedPrompt = `CATALOG (JSON):\n${JSON.stringify(catalog)}\n\nPRIOR CONVERSATION:\n${historyBlock}\n\nUSER MESSAGE:\n${message.trim()}\n\nRespond with the strict JSON object described in your instructions.`;

    const raw = await callGroq(combinedPrompt);

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (err) {
      // Fallback: try to strip stray markdown fences if the model slipped up.
      const cleaned = raw
        .replace(/^```(?:json)?/i, "")
        .replace(/```$/i, "")
        .trim();
      try {
        parsed = JSON.parse(cleaned);
      } catch (err2) {
        console.error("Failed to parse Groq response as JSON:", raw);
        return res.status(502).json({
          success: false,
          error: "Model returned a non-JSON response.",
        });
      }
    }

    const reply =
      typeof parsed.reply === "string" && parsed.reply.trim()
        ? parsed.reply.trim()
        : "Here is what I found for you.";
    const recommendations = Array.isArray(parsed.recommendations)
      ? parsed.recommendations
          .filter(
            (r) => r && typeof r.id === "string" && typeof r.title === "string",
          )
          .slice(0, 5)
          .map((r) => ({
            id: r.id,
            title: r.title,
            price: Number(r.price) || 0,
            reason: typeof r.reason === "string" ? r.reason : "",
          }))
      : [];

    res.json({ success: true, data: { reply, recommendations } });
  } catch (error) {
    console.error("Chatbot error:", {
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
      requestBody: {
        message: req.body?.message,
        historyLength: Array.isArray(req.body?.history)
          ? req.body.history.length
          : 0,
      },
    });
    const msg = error instanceof Error ? error.message : "Chatbot failed";
    res.status(500).json({ success: false, error: msg });
  }
});

export default router;