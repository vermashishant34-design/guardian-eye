// Gemini AI session summary generator
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { events } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const eventDigest = (events ?? [])
      .slice(0, 50)
      .map(
        (e: any) =>
          `- ${new Date(e.timestamp).toLocaleTimeString()}: ${e.faceCount} face(s), level=${e.threatLevel}`
      )
      .join("\n");

    const resp = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            {
              role: "system",
              content:
                "You are ShieldEye security analyst. Write a concise (3-4 sentence) session summary with threat stats, pattern insights, and one recommendation.",
            },
            {
              role: "user",
              content: `Session events:\n${eventDigest || "No events recorded."}\n\nWrite the summary now.`,
            },
          ],
        }),
      }
    );

    if (!resp.ok) {
      if (resp.status === 429 || resp.status === 402) {
        return new Response(
          JSON.stringify({
            summary: "AI summary temporarily unavailable (rate limit or credits). Please try again later.",
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error("AI gateway failed");
    }

    const data = await resp.json();
    const summary =
      data.choices?.[0]?.message?.content ?? "No summary generated.";

    return new Response(JSON.stringify({ summary }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-summary error:", e);
    return new Response(
      JSON.stringify({
        summary: "Summary generation failed. Please retry.",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
