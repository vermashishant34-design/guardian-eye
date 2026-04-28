// Gemini AI threat analysis edge function
// Analyzes webcam frames to confirm shoulder surfing threats

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
    const { frame, faceCount } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const systemPrompt = `You are ShieldEye, a cybersecurity AI that detects shoulder surfing attacks.
Analyze the webcam frame and determine if there is a genuine shoulder surfing threat.
Consider: number of faces, their position (behind/beside the user), gaze direction, and distance.
Respond ONLY via the classify_threat tool call.`;

    const userPrompt = `Face detection reported ${faceCount} face(s) in the frame. Analyze the image and classify the threat.`;

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
            { role: "system", content: systemPrompt },
            {
              role: "user",
              content: [
                { type: "text", text: userPrompt },
                { type: "image_url", image_url: { url: frame } },
              ],
            },
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "classify_threat",
                description: "Classify shoulder surfing threat",
                parameters: {
                  type: "object",
                  properties: {
                    isThreat: { type: "boolean" },
                    confidence: { type: "number", minimum: 0, maximum: 1 },
                    message: {
                      type: "string",
                      description: "Short user-facing alert (1 sentence)",
                    },
                    reasoning: {
                      type: "string",
                      description: "Brief reasoning explaining the decision",
                    },
                  },
                  required: ["isThreat", "confidence", "message", "reasoning"],
                  additionalProperties: false,
                },
              },
            },
          ],
          tool_choice: {
            type: "function",
            function: { name: "classify_threat" },
          },
        }),
      }
    );

    if (!resp.ok) {
      if (resp.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limits exceeded" }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (resp.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits required" }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const t = await resp.text();
      console.error("AI gateway error:", resp.status, t);
      throw new Error("AI gateway failed");
    }

    const data = await resp.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    const args = toolCall ? JSON.parse(toolCall.function.arguments) : null;

    const result = args ?? {
      isThreat: faceCount > 1,
      confidence: 0.6,
      message:
        faceCount > 1
          ? `${faceCount} faces detected — possible shoulder surfing.`
          : "Environment appears secure.",
      reasoning: "Fallback heuristic — AI did not return a structured result.",
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-threat error:", e);
    return new Response(
      JSON.stringify({
        error: e instanceof Error ? e.message : "Unknown error",
        isThreat: false,
        confidence: 0,
        message: "Analysis unavailable",
        reasoning: "Edge function error — using local detection only.",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
