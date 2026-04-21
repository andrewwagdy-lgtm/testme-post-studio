import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are a content creator for TestMe, a language assessment company serving universities and schools. You write accurate, well-sourced social media posts about language testing and assessment.

ACCURACY RULES — strictly follow these:
- Only cite real, verifiable sources (real scholars, real publications, real statistics).
- If you include a quote, it must be a genuine quote from a real person — never fabricate quotes.
- If you include a statistic, it must be a real, published figure. Cite the source and year.
- For "Expert Quote" posts: only use real, attributed quotes from real applied linguists or assessment scholars (e.g. Elana Shohamy, Lyle Bachman, Samuel Messick, Bernard Spolsky, Alan Davies, J.D. Brown, etc.).
- For "Trivia" and "Fact" posts: cite real research, institutions, or publications.
- For "Tip" posts: ground advice in established assessment principles (validity, reliability, washback, etc.).
- Never invent statistics, quotes, or sources.

Respond ONLY with valid JSON — no markdown, no backticks, no preamble.`;

export async function POST(req) {
  try {
    const { postType, platform, topic } = await req.json();

    if (!process.env.ANTHROPIC_API_KEY) {
      return Response.json({ error: "ANTHROPIC_API_KEY not configured." }, { status: 500 });
    }

    const typeLabels = {
      trivia: "Language Trivia",
      quote: "Expert Quote",
      fact: "Assessment Fact",
      tip: "Testing Tip",
    };

    const userPrompt = `Create a "${typeLabels[postType]}" social media post for ${platform} about: "${topic}".

Return ONLY this JSON:
{
  "headline": "Punchy headline, max 10 words. For quotes use actual quote in double curly braces e.g. {{quote text here}}",
  "body": "2-3 sentences, max 55 words. Accurate, engaging, educational. For quotes: include the real quote and attribute it clearly.",
  "source": "Real source — author name + publication/institution + year. Leave empty string if not applicable for tips.",
  "caption": "${platform} caption, 80-130 words. Hook opening, expand the point, end with a question or CTA for educators or institutions. Warm and professional tone.",
  "hashtags": "8 relevant hashtags as a single space-separated string. Mix broad and niche tags relevant to language testing and education."
}`;

    const message = await client.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userPrompt }],
    });

    const raw = message.content.map((b) => (b.type === "text" ? b.text : "")).join("");
    const clean = raw.replace(/```json|```/g, "").trim();
    const post = JSON.parse(clean);

    return Response.json({ post, typeLabel: typeLabels[postType] });
  } catch (err) {
    console.error(err);
    return Response.json({ error: err.message || "Generation failed." }, { status: 500 });
  }
}
