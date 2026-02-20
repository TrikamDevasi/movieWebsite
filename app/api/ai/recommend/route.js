import OpenAI from 'openai';

export async function POST(request) {
  // Guard: fail gracefully if API key not configured
  if (!process.env.OPENAI_API_KEY) {
    return Response.json({
      recommendations: [],
      error: "AI service not configured"
    }, { status: 503 });
  }

  // Initialise client inside the handler — never at module/build time
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  try {
    const { mood } = await request.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{
        role: "user",
        content: `Recommend 5 movies perfect for someone feeling "${mood}". Return ONLY valid JSON array like:
        [
          {"title": "Movie Name", "overview": "Brief description..."},
          {"title": "Movie Name", "overview": "Brief description..."}
        ]
        No other text, just the JSON array.`
      }],
      max_tokens: 500,
      temperature: 0.7,
    });

    const movies = JSON.parse(completion.choices[0].message.content);

    return Response.json({
      recommendations: Array.isArray(movies) ? movies : []
    });
  } catch (error) {
    console.error("OpenAI API Error:", error);
    return Response.json({
      recommendations: [],
      error: "AI service temporarily unavailable"
    }, { status: 500 });
  }
}
