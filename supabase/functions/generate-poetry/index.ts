import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-app-id',
}

serve(async (req) => {
  // Preflight Request Handle
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // ১. ফ্রন্টএন্ড থেকে আসা পুরো ডেটাটা (Body) ডাইরেক্ট নিয়ে নাও
    const requestBody = await req.json()
    
    // ২. API Key চেক করো
    const apiKey = Deno.env.get('GEMINI_API_KEY')
    if (!apiKey) {
      throw new Error("API Key is missing in backend!")
    }

    // ৩. কোনো কাটছাঁট না করে ফ্রন্টএন্ডের ডেটাটাই সোজা জেমিনিকে পাঠিয়ে দাও
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody) // ডাইরেক্ট ফ্রন্টএন্ডের পেলোড
    })

    // ৪. রেসপন্স ফ্রন্টএন্ডে পাঠানো
    return new Response(response.body, {
      headers: { 
        ...corsHeaders,
        'Content-Type': 'text/event-stream' 
      }
    })

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})