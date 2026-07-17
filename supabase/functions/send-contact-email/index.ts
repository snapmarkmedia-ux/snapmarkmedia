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

    // Step 3: Send Owner Notification Email (One email only)
    let emailSent = true
    try {
      const adminEmail = Deno.env.get('ADMIN_EMAIL') || 'snapmarkmedia@gmail.com'
      const submissionDate = created_at 
        ? new Date(created_at).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })
        : new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })

      const ownerEmailResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'Snapmark Media Contact <onboarding@resend.dev>',
          to: adminEmail,
          subject: `🚀 New Lead • ${full_name}`,
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>New Project Enquiry Received</title>
            </head>
            <body style="font-family: Arial, Helvetica, sans-serif; background-color: #F5F7FB; margin: 0; padding: 40px 10px; -webkit-font-smoothing: antialiased;">
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #F5F7FB; width: 100%;">
                <tr>
                  <td align="center" style="padding: 10px 0;">
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 650px; background-color: #ffffff; border-radius: 16px; box-shadow: 0 10px 30px rgba(15, 23, 42, 0.05); overflow: hidden; border-collapse: separate;">
                      
                      <!-- HEADER -->
                      <tr>
                        <td style="background: linear-gradient(135deg, #0B1E4F 0%, #2563EB 100%); padding: 40px; text-align: center;">
                          <h1 style="margin: 0; font-family: Arial, Helvetica, sans-serif; font-size: 28px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">SnapMarkMedia</h1>
                          <p style="margin: 12px 0 0 0; font-family: Arial, Helvetica, sans-serif; font-size: 20px; font-weight: 700; color: #ffffff; opacity: 0.95;">🚀 New Project Enquiry Received</p>
                        </td>
                      </tr>

                      <!-- BODY CONTAINER -->
                      <tr>
                        <td style="padding: 40px 30px;">
                          
                          <!-- CLIENT INFORMATION -->
                          <h2 style="margin: 0 0 20px 0; font-family: Arial, Helvetica, sans-serif; font-size: 22px; font-weight: 700; color: #0F172A;">👤 Client Information</h2>
                          
                          <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse: collapse; margin-bottom: 35px;">
                            
                            <!-- Full Name -->
                            <tr style="background-color: #F8FAFC;">
                              <td style="padding: 14px 16px; font-family: Arial, Helvetica, sans-serif; font-size: 14px; font-weight: bold; color: #64748B; border-bottom: 1px solid #E2E8F0; width: 35%;">👤 Full Name</td>
                              <td style="padding: 14px 16px; font-family: Arial, Helvetica, sans-serif; font-size: 15px; font-weight: 600; color: #0F172A; border-bottom: 1px solid #E2E8F0;">${full_name}</td>
                            </tr>
                            
                            <!-- Email -->
                            <tr>
                              <td style="padding: 14px 16px; font-family: Arial, Helvetica, sans-serif; font-size: 14px; font-weight: bold; color: #64748B; border-bottom: 1px solid #E2E8F0;">📧 Email Address</td>
                              <td style="padding: 14px 16px; font-family: Arial, Helvetica, sans-serif; font-size: 15px; font-weight: 600; color: #2563EB; border-bottom: 1px solid #E2E8F0;">
                                <a href="mailto:${email}" style="color: #2563EB; text-decoration: none;">${email}</a>
                              </td>
                            </tr>
                            
                            <!-- Phone -->
                            <tr style="background-color: #F8FAFC;">
                              <td style="padding: 14px 16px; font-family: Arial, Helvetica, sans-serif; font-size: 14px; font-weight: bold; color: #64748B; border-bottom: 1px solid #E2E8F0;">📱 Phone Number</td>
                              <td style="padding: 14px 16px; font-family: Arial, Helvetica, sans-serif; font-size: 15px; font-weight: 600; color: #0F172A; border-bottom: 1px solid #E2E8F0;">${phone || 'Not provided'}</td>
                            </tr>
                            
                            <!-- Service -->
                            <tr>
                              <td style="padding: 14px 16px; font-family: Arial, Helvetica, sans-serif; font-size: 14px; font-weight: bold; color: #64748B; border-bottom: 1px solid #E2E8F0;">🛠 Service Required</td>
                              <td style="padding: 14px 16px; font-family: Arial, Helvetica, sans-serif; border-bottom: 1px solid #E2E8F0;">
                                <span style="display: inline-block; background-color: #DBEAFE; color: #1D4ED8; font-size: 13px; font-weight: bold; padding: 6px 12px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 0.5px;">
                                  ${service || 'General Enquiry'}
                                </span>
                              </td>
                            </tr>
                          </table>

                          <!-- MESSAGE -->
                          <h2 style="margin: 0 0 20px 0; font-family: Arial, Helvetica, sans-serif; font-size: 22px; font-weight: 700; color: #0F172A;">💬 Client Message</h2>
                          <div style="background-color: #F8FAFC; border: 1px solid #E5E7EB; border-radius: 12px; padding: 20px; font-family: Arial, Helvetica, sans-serif; font-size: 15px; color: #0F172A; line-height: 1.6; white-space: pre-wrap; word-break: break-word;">${message}</div>

                        </td>
                      </tr>

                      <!-- FOOTER -->
                      <tr>
                        <td style="background-color: #F8FAFC; border-top: 1px solid #E2E8F0; padding: 30px; text-align: center;">
                          <table cellpadding="0" cellspacing="0" border="0" width="100%">
                            <tr>
                              <td style="padding-bottom: 15px; font-family: Arial, Helvetica, sans-serif; font-size: 12px; color: #64748B; line-height: 1.5;">
                                <strong>Submission Time:</strong> ${submissionDate}<br>
                                <strong>Database Table:</strong> contact_submissions<br>
                                <strong>Environment:</strong> Production
                              </td>
                            </tr>
                            <tr>
                              <td style="padding-top: 15px; border-top: 1px solid #E2E8F0; font-family: Arial, Helvetica, sans-serif; font-size: 11px; color: #94A3B8; line-height: 1.4;">
                                This enquiry was automatically generated from the SnapMarkMedia website contact form.
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>

                    </table>
                  </td>
                </tr>
              </table>
            </body>
            </html>
          `
        })
      })

      if (!ownerEmailResponse.ok) {
        const errorText = await ownerEmailResponse.text()
        throw new Error(`Resend owner notification failed: ${errorText}`)
      }
    } catch (ownerEmailError) {
      console.error('Owner notification email failed to send:', ownerEmailError)
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
