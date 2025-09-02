export const template = ({ firstName, otp, subject }) => `<!--
  Subject: ${subject} ✉️
  Preheader: Enter the 6‑digit code to finish setting up your account
-->
<!doctype html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
  <head>
    <meta charset="utf-8"> 
    <meta name="viewport" content="width=device-width,initial-scale=1"> 
    <meta http-equiv="X-UA-Compatible" content="IE=edge"> 
    <meta name="x-apple-disable-message-reformatting"> 
    <meta name="format-detection" content="telephone=no,address=no,email=no,date=no,url=no">
    <title>${subject}</title>
    <!--[if mso]>
      <noscript>
        <xml>
          <o:OfficeDocumentSettings>
            <o:AllowPNG/>
            <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
        </xml>
      </noscript>
      <style type="text/css">
        table {border-collapse: collapse;}
        td, div, p, a {font-family: Arial, sans-serif !important;}
      </style>
    <![endif]-->
    <style>
      /* Dark mode tweaks for Apple Mail / iOS */
      @media (prefers-color-scheme: dark) {
        .bg { background-color:#0b0c10 !important; }
        .card { background-color:#141820 !important; }
        .muted { color:#c9d1d9 !important; }
        .title, .code { color:#ffffff !important; }
        .btn { background:#2f81f7 !important; color:#ffffff !important; }
      }
      /* Mobile */
      @media screen and (max-width:600px){
        .container{ width:100% !important; }
        .px{ padding-left:20px !important; padding-right:20px !important; }
        .code{ font-size:28px !important; letter-spacing:6px !important; }
      }
      /* General resets */
      body{ margin:0; padding:0; background:#f3f4f6; }
      img{ border:0; outline:none; text-decoration:none; height:auto; display:block; }
      a{ text-decoration:none; }
    </style>
  </head>
  <body class="bg" style="margin:0; padding:0; background:#f3f4f6;">
    <!-- Preheader (hidden) -->
    <div style="display:none; max-height:0; overflow:hidden; mso-hide:all;">Use this one-time code to verify your email.</div>

    <center role="article" aria-roledescription="email" lang="en" style="width:100%; background:#f3f4f6;">
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#f3f4f6;">
        <tr>
          <td align="center" style="padding:24px 12px;">
            <table role="presentation" cellpadding="0" cellspacing="0" width="600" class="container" style="width:600px; max-width:600px;">
              <!-- Header / Logo -->
              <tr>
                <td align="left" class="px" style="padding:24px 32px;">
                  <a href="{{appUrl}}" target="_blank" style="display:inline-flex; align-items:center; gap:8px; color:#111827;">
                    <img src="https://via.placeholder.com/32x32.png" width="32" height="32" alt="Logo" style="border-radius:6px;">
                    <span style="font:600 16px/1.2 system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; color:#111827;">{{brandName}}</span>
                  </a>
                </td>
              </tr>

              <!-- Card -->
              <tr>
                <td class="card" style="background:#ffffff; border-radius:16px; box-shadow:0 6px 24px rgba(0,0,0,.06);">
                  <table width="100%" role="presentation" cellpadding="0" cellspacing="0">
                    <tr>
                      <td class="px" style="padding:32px;">
                        <h1 class="title" style="margin:0 0 12px 0; font:700 22px/1.25 system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; color:#111827;">${subject}</h1>
                        <p class="muted" style="margin:0; font:400 16px/1.6 system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; color:#4b5563;">
                         ${subject}  <strong>${firstName}</strong>,
                          <br>
                          Thanks for signing up! Enter the one‑time code below to verify your email address for <strong>{{brandName}}</strong>.
                        </p>

                        <!-- OTP Block -->
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:20px;">
                          <tr>
                            <td align="center" style="background:#111827; color:#ffffff; border-radius:12px; padding:16px 20px;">
                              <div class="code" style="font:700 32px/1.2 ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace; letter-spacing:8px; color:#ffffff;">
                                ${otp}
                              </div>
                            </td>
                          </tr>
                        </table>

                        <!-- CTA Button (optional deep link) -->
                        <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:20px;">
                          <tr>
                            <td align="center" bgcolor="#111827" style="border-radius:10px;">
                              <a class="btn" href="{{confirmUrl}}" target="_blank" style="display:inline-block; padding:12px 18px; font:600 15px/1 system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; color:#ffffff; background:#111827; border-radius:10px;">
                                Verify email
                              </a>
                            </td>
                          </tr>
                        </table>

                        <!-- Footnotes -->
                        <p class="muted" style="margin:16px 0 0 0; font:400 14px/1.6 system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; color:#6b7280;">
                          This code expires in <strong>{{otpTtlMinutes}} minutes</strong>. If you didn’t request this, you can safely ignore this email.
                        </p>

                        <p class="muted" style="margin:8px 0 0 0; font:400 14px/1.6 system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; color:#6b7280;">
                          Need help? Contact us at <a href="mailto:{{supportEmail}}" style="color:#2563eb;">{{supportEmail}}</a>
                        </p>

                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td class="px" align="center" style="padding:20px 32px;">
                  <p class="muted" style="margin:0; font:400 12px/1.6 system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; color:#9ca3af;">
                    © {{year}} {{brandName}} · <a href="{{preferencesUrl}}" target="_blank" style="color:#6b7280;">Email preferences</a>
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </center>
  </body>
</html>
`;
