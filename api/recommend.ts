import type { VercelRequest, VercelResponse } from "@vercel/node";

interface RecommendRequest {
  text: string;
}

interface RecommendSuccess {
  titles: string[];
}

interface RecommendError {
  error: string;
}

type RecommendResponse = RecommendSuccess | RecommendError;

export default async function handler(
  req: VercelRequest,
  res: VercelResponse<RecommendResponse>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { text } = req.body as RecommendRequest;

  if (!text || !text.trim()) {
    return res.status(400).json({ error: "Missing text field" });
  }

  try {
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY as string,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Suggest 6 movie or TV show titles that match this mood or request: "${text}". Only return real, existing titles.`,
                },
              ],
            },
          ],
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema: {
              type: "array",
              items: { type: "string" },
            },
          },
        }),
      }
    );

    const data = await geminiResponse.json();
    const rawText = data.candidates[0].content.parts[0].text;
    const titles: string[] = JSON.parse(rawText);

    return res.status(200).json({ titles });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to get recommendations" });
  }
}