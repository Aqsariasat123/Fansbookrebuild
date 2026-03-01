export function wrapInLayout(title: string, bodyHtml: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
</head>
<body style="margin:0; padding:0; background-color:#15191c; font-family:'Outfit',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#15191c; padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#0e1012; border-radius:22px; overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="padding:30px 40px; text-align:center; background:linear-gradient(90deg,#01adf1,#a61651);">
              <h1 style="margin:0; font-size:28px; color:#ffffff; font-weight:600;">Fansbook</h1>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              ${bodyHtml}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px 30px; text-align:center; border-top:1px solid #2a2d30;">
              <p style="margin:0; font-size:12px; color:#5d5d5d;">&copy; ${new Date().getFullYear()} Fansbook. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
