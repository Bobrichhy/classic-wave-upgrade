import { GoogleGenAI, Type } from "@google/genai";
import { PRODUCTS } from "../../constants";

function getClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("API_KEY_MISSING");
  return new GoogleGenAI({ apiKey });
}

// Map thrown errors to a normalized code the client understands
export const normalizeError = (error: any): string => {
  const msg = (error?.message || '').toLowerCase();
  if (msg.includes('api_key_missing')) return 'API_KEY_MISSING';
  if (msg.includes('quota') || msg.includes('resource_exhausted') || msg.includes('429')) return 'QUOTA_EXCEEDED';
  if (msg.includes('fetch failed') || msg.includes('network')) return 'NETWORK_ERROR';
  return 'UNKNOWN_ERROR';
};

export async function scentRecommendation(answers: { mood: string; occasion: string; preference: string }) {
  const ai = getClient();

  const prompt = `You are a world-class fragrance expert for Classic Wave Store at UNILAG.
Based on these user preferences:
- Mood: ${answers.mood}
- Occasion: ${answers.occasion}
- Scent Preference: ${answers.preference}

Select the single most relevant product from this catalog:
${JSON.stringify(PRODUCTS.map(p => ({ id: p.id, name: p.name, desc: p.description })))}

Return JSON only.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          productId: { type: Type.STRING, description: "The ID of the recommended product" },
          reason: { type: Type.STRING, description: "A one-sentence luxury explanation of why this matches" }
        },
        required: ["productId", "reason"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("Empty AI response");
  return JSON.parse(text);
}

export async function generateImage(productName: string) {
  const ai = getClient();

  const prompt = `High-end commercial photography of a luxury fragrance bottle named "${productName}".
Premium glass bottle, exquisite cap design, soft dramatic studio lighting, ultra-detailed.
Dark reflective marble surface, soft mist background, 8K resolution, elegant luxury atmosphere.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: prompt,
    config: { responseModalities: ['IMAGE', 'TEXT'] }
  });

  if (response.candidates?.[0]?.content?.parts) {
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
  }

  throw new Error("No image data returned from Gemini");
}

export async function analyzeImage(base64Data: string, mimeType: string) {
  const ai = getClient();

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: {
      parts: [
        { inlineData: { mimeType, data: base64Data } },
        {
          text: `You are a luxury fragrance connoisseur. Analyze this image.
If it shows a perfume or beauty product, respond in this exact structure:

**IDENTIFICATION**
[Name/brand if visible, or describe the style]

**SCENT NOTES**
[Guess top, heart, and base notes based on the bottle aesthetic]

**PERSONA**
[Describe who would wear this — lifestyle, personality, occasion]

**VIBE**
[Describe the packaging mood in 1–2 evocative sentences]

**VERDICT**
[One luxury summary sentence]

If it is not a fragrance, respond in a sophisticated tone describing what you see.`
        }
      ]
    }
  });

  return response.text;
}
