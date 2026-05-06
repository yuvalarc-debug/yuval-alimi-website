const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

function emailHtml({ email, guideTitle, guideUrl, guideDescription }) {
  return `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${guideTitle}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Heebo:wght@400;600;700;800&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Heebo', Arial, sans-serif; background: #f4f7f4; direction: rtl; }
  </style>
</head>
<body>
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7f4; padding: 40px 0;">
  <tr>
    <td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%;">

        <!-- Header -->
        <tr>
          <td style="background:#050a05; border-radius:16px 16px 0 0; padding: 32px 40px; text-align:right;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  <div style="display:inline-block; background:#52b788; border-radius:10px; width:40px; height:40px; text-align:center; line-height:40px; font-weight:800; font-size:16px; color:#050a05; vertical-align:middle;">YA</div>
                  <span style="color:#e8f5ee; font-size:16px; font-weight:700; vertical-align:middle; margin-right:10px;">יובל עלימי</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Hero -->
        <tr>
          <td style="background:#0c130c; padding: 48px 40px 40px; text-align:right;">
            <p style="color:#52b788; font-size:13px; font-weight:600; letter-spacing:1px; text-transform:uppercase; margin-bottom:16px;">המדריך שלך מוכן ✓</p>
            <h1 style="color:#e8f5ee; font-size:32px; font-weight:800; line-height:1.2; margin-bottom:16px;">${guideTitle}</h1>
            <p style="color:#8db5a0; font-size:16px; line-height:1.7; margin-bottom:32px;">${guideDescription || 'תודה שנרשמת! המדריך המלא מחכה לך בכפתור למטה.'}</p>
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="background:#52b788; border-radius:100px; padding: 0;">
                  <a href="${guideUrl}" style="display:inline-block; padding:16px 40px; color:#050a05; font-size:16px; font-weight:700; text-decoration:none; border-radius:100px;">
                    הורד את המדריך ←
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Divider -->
        <tr>
          <td style="background:#0c130c; padding: 0 40px;">
            <div style="border-top: 1px solid #1e2d1e;"></div>
          </td>
        </tr>

        <!-- What's inside -->
        <tr>
          <td style="background:#0c130c; padding: 32px 40px; text-align:right;">
            <p style="color:#8db5a0; font-size:13px; font-weight:600; letter-spacing:1px; text-transform:uppercase; margin-bottom:20px;">מה תמצא במדריך</p>
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:10px 0; border-bottom:1px solid #1e2d1e;">
                  <span style="color:#52b788; margin-left:12px;">✓</span>
                  <span style="color:#e8f5ee; font-size:15px;">הבסיס המעשי לתכנון מבנה ירוק</span>
                </td>
              </tr>
              <tr>
                <td style="padding:10px 0; border-bottom:1px solid #1e2d1e;">
                  <span style="color:#52b788; margin-left:12px;">✓</span>
                  <span style="color:#e8f5ee; font-size:15px;">השוואת מסלולי הסמכה — LEED, BREEAM, דירוג ירוק</span>
                </td>
              </tr>
              <tr>
                <td style="padding:10px 0; border-bottom:1px solid #1e2d1e;">
                  <span style="color:#52b788; margin-left:12px;">✓</span>
                  <span style="color:#e8f5ee; font-size:15px;">טיפים לחיסכון בעלויות ההסמכה</span>
                </td>
              </tr>
              <tr>
                <td style="padding:10px 0;">
                  <span style="color:#52b788; margin-left:12px;">✓</span>
                  <span style="color:#e8f5ee; font-size:15px;">רשימת משאבים ותקנים רלוונטיים</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#050a05; border-radius:0 0 16px 16px; padding: 32px 40px; text-align:right;">
            <p style="color:#4d6b5a; font-size:13px; line-height:1.7;">
              קיבלת מייל זה כי נרשמת לקבל את המדריך באתר יובל עלימי.<br/>
              שאלות? ענה על מייל זה או כתוב ל־<a href="mailto:yuvalarc@gmail.com" style="color:#52b788;">yuvalarc@gmail.com</a>
            </p>
            <p style="color:#2d422d; font-size:12px; margin-top:16px;">
              © 2025 יובל עלימי ייעוץ בנייה ירוקה · תל אביב-יפו
            </p>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
</body>
</html>`;
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, guideTitle, guideUrl, guideDescription } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'כתובת מייל לא תקינה' });
  }

  try {
    // Send guide to subscriber
    await resend.emails.send({
      from: `${process.env.SENDER_NAME || 'יובל עלימי'} <${process.env.FROM_EMAIL || 'onboarding@resend.dev'}>`,
      to: email,
      subject: `המדריך שלך מוכן: ${guideTitle}`,
      html: emailHtml({ email, guideTitle, guideUrl, guideDescription }),
    });

    // Notify owner
    if (process.env.NOTIFICATION_EMAIL) {
      await resend.emails.send({
        from: `${process.env.SENDER_NAME || 'יובל עלימי'} <${process.env.FROM_EMAIL || 'onboarding@resend.dev'}>`,
        to: process.env.NOTIFICATION_EMAIL,
        subject: `ליד חדש — ${guideTitle}`,
        html: `<div dir="rtl" style="font-family:Arial; padding:20px;"><p>מייל חדש נרשם למדריך "<strong>${guideTitle}</strong>":</p><p style="font-size:20px; color:#52b788;">${email}</p></div>`,
      });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Resend error:', err);
    return res.status(500).json({ error: 'שגיאה בשליחת המייל' });
  }
};
