import nodemailer from "nodemailer";

export type LeadPayload = {
  nombres: string;
  apellidos: string;
  correo: string;
  celular: string;
};

const recipientEmail =
  import.meta.env.CHILDFUND_EMAIL_TO || "donantesmx@childfund.org";

const smtpHost = import.meta.env.CHILDFUND_SMTP_HOST || "smtp.gmail.com";
const smtpPort = Number(import.meta.env.CHILDFUND_SMTP_PORT || 465);
const smtpUser = import.meta.env.CHILDFUND_SMTP_USER;
const smtpPass = import.meta.env.CHILDFUND_SMTP_PASS;
const fromEmail = import.meta.env.CHILDFUND_EMAIL_FROM || smtpUser;
const campaignName = "Soy más verde con ChildFund";

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const buildLeadHtml = (lead: LeadPayload) => `
  <table width="100%" cellpadding="0" cellspacing="0" style="font-family: Arial, sans-serif; background: #f4f7f5; padding: 24px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background: #ffffff; border-radius: 12px; overflow: hidden;">
          <tr>
            <td style="background: #00c384; color: #ffffff; padding: 24px;">
              <h1 style="margin: 0; font-size: 24px;">${campaignName}</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px; color: #111111; font-size: 16px; line-height: 1.5;">
              <p><strong>Nombre(s):</strong> ${escapeHtml(lead.nombres)}</p>
              <p><strong>Apellidos:</strong> ${escapeHtml(lead.apellidos)}</p>
              <p><strong>Correo:</strong> ${escapeHtml(lead.correo)}</p>
              <p><strong>Celular:</strong> ${escapeHtml(lead.celular)}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
`;

export const sendLeadEmail = async (lead: LeadPayload) => {
  if (!smtpUser || !smtpPass || !fromEmail) {
    throw new Error("Faltan variables SMTP de ChildFund");
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  const info = await transporter.sendMail({
    from: fromEmail,
    to: recipientEmail,
    replyTo: lead.correo,
    subject: `${campaignName} · Nuevo lead de apadrinamiento`,
    text: [
      campaignName,
      `Nombre(s): ${lead.nombres}`,
      `Apellidos: ${lead.apellidos}`,
      `Correo: ${lead.correo}`,
      `Celular: ${lead.celular}`,
    ].join("\n"),
    html: buildLeadHtml(lead),
  });

  return Boolean(info.accepted?.length);
};
