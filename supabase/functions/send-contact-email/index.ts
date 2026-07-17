import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    const resendApiKey = Deno.env.get('RESEND_API_KEY') ?? ''

    // Initialize Supabase Client
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Parse the request body
    const body = await req.json()
    
    // Check if it is a database webhook trigger
    const isWebhook = body.type === 'INSERT' && body.table === 'contact_submissions'
    
    const record = isWebhook ? body.record : body
    const { full_name, email, phone, service, message, created_at } = record

    // Step 1: Input Validation
    if (!full_name || !email || !message) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: full_name, email, and message are required.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Step 2: Insert into database only if NOT called from webhook
    if (!isWebhook) {
      const { error: dbError } = await supabase
        .from('contact_submissions')
        .insert([
          {
            full_name,
            email,
            phone: phone || null,
            service: service || null,
            message,
            status: 'new'
          }
        ])

      if (dbError) {
        console.error('Database insertion error:', dbError)
        return new Response(
          JSON.stringify({ error: `Database submission failed: ${dbError.message}` }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    // Step 3: Send professional email notification using Resend
    let emailSent = true
    try {
      const adminEmail = Deno.env.get('ADMIN_EMAIL') || 'snapmarkmedia@gmail.com'
      const submissionDate = created_at 
        ? new Date(created_at).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })
        : new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })

      const emailResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'Snapmark Media Contact <onboarding@resend.dev>',
          to: adminEmail,
          subject: `New Enquiry from ${full_name}`,
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <title>New Contact Submission</title>
              <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0b0b0f; color: #f3f4f6; margin: 0; padding: 40px 20px; }
                .container { max-width: 600px; margin: 0 auto; background: rgba(255, 255, 255, 0.01); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 24px; padding: 40px; box-shadow: 0 20px 40px rgba(0,0,0,0.3); backdrop-filter: blur(10px); }
                h2 { font-size: 24px; font-weight: 600; margin-top: 0; margin-bottom: 24px; color: #fff; letter-spacing: -0.5px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 16px; }
                .field { margin-bottom: 20px; }
                .label { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: rgba(255,255,255,0.4); margin-bottom: 6px; font-weight: 600; }
                .value { font-size: 15px; color: #fff; line-height: 1.5; }
                .message-box { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 12px; padding: 16px; font-style: italic; white-space: pre-wrap; color: rgba(255,255,255,0.9); }
                .footer { margin-top: 40px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px; font-size: 11px; text-align: center; color: rgba(255,255,255,0.3); letter-spacing: 0.5px; }
              </style>
            </head>
            <body>
              <div class="container">
                <h2>New Contact Enquiry</h2>
                
                <div class="field">
                  <div class="label">Full Name</div>
                  <div class="value">${full_name}</div>
                </div>
                
                <div class="field">
                  <div class="label">Email Address</div>
                  <div class="value"><a href="mailto:${email}" style="color: #60a5fa; text-decoration: none;">${email}</a></div>
                </div>
                
                <div class="field">
                  <div class="label">Phone Number</div>
                  <div class="value">${phone || 'Not provided'}</div>
                </div>
                
                <div class="field">
                  <div class="label">Service Required</div>
                  <div class="value" style="color: #d8b4fe; font-weight: 500;">${service || 'General Enquiry'}</div>
                </div>

                <div class="field">
                  <div class="label">Submission Date & Time</div>
                  <div class="value" style="color: #93c5fd;">${submissionDate}</div>
                </div>
                
                <div class="field">
                  <div class="label">Message</div>
                  <div class="value message-box">${message}</div>
                </div>
                
                <div class="footer">
                  Sent automatically via SnapMark Media Portal.
                </div>
              </div>
            </body>
            </html>
          `
        })
      })

      if (!emailResponse.ok) {
        const errorText = await emailResponse.text()
        throw new Error(`Resend API request failed: ${errorText}`)
      }
    } catch (emailError) {
      console.error('Email notification failed to send:', emailError)
      emailSent = false
    }

    // Step 4: Return JSON response
    return new Response(
      JSON.stringify(emailSent ? { success: true } : { success: true, emailSent: false }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Edge Function runtime error:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
