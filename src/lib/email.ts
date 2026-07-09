import nodemailer from "nodemailer";
import type { Booking } from "./db";
import { getPackageById, formatDateNL, type PackageId } from "./packages";

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

function buildAdminEmailHtml(booking: Booking): string {
  const pkg = getPackageById(booking.package as PackageId);
  const dateFormatted = formatDateNL(booking.date);

  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family: Inter, sans-serif; color: #111; max-width: 600px; margin: 0 auto; padding: 32px;">
      <h1 style="font-size: 24px; margin-bottom: 8px;">Nieuwe boeking — HeyNoona</h1>
      <p style="color: #666; margin-bottom: 32px;">Er is een nieuwe photobooth boeking binnengekomen.</p>

      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #888; width: 140px;">Datum</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #eee; font-weight: 600;">${dateFormatted}</td></tr>
        <tr><td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #888;">Tijd</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #eee; font-weight: 600;">${booking.startTime} – ${booking.endTime}</td></tr>
        <tr><td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #888;">Pakket</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #eee; font-weight: 600;">${pkg?.emoji ?? ""} ${pkg?.name ?? booking.package} (${pkg?.priceLabel ?? ""})</td></tr>
        <tr><td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #888;">Naam</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #eee;">${booking.name}</td></tr>
        <tr><td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #888;">E-mail</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #eee;"><a href="mailto:${booking.email}">${booking.email}</a></td></tr>
        <tr><td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #888;">Telefoon</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #eee;"><a href="tel:${booking.phone}">${booking.phone}</a></td></tr>
        <tr><td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #888;">Event</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #eee;">${booking.eventType}</td></tr>
        ${booking.message ? `<tr><td style="padding: 12px 0; color: #888; vertical-align: top;">Bericht</td>
            <td style="padding: 12px 0;">${booking.message}</td></tr>` : ""}
      </table>

      <p style="margin-top: 32px; font-size: 12px; color: #aaa;">Boeking ID: ${booking.id}</p>
    </body>
    </html>
  `;
}

function buildCustomerEmailHtml(booking: Booking): string {
  const pkg = getPackageById(booking.package as PackageId);
  const dateFormatted = formatDateNL(booking.date);

  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family: Inter, sans-serif; color: #111; max-width: 600px; margin: 0 auto; padding: 32px;">
      <h1 style="font-size: 28px; margin-bottom: 8px;">Bedankt, ${booking.name}! 🫧</h1>
      <p style="color: #666; margin-bottom: 32px;">Je boeking bij HeyNoona is bevestigd. We kijken ernaar uit!</p>

      <div style="background: #FFF8F7; border-radius: 16px; padding: 24px; margin-bottom: 24px;">
        <p style="margin: 0 0 8px; font-size: 14px; color: #888; text-transform: uppercase; letter-spacing: 0.1em;">Jouw boeking</p>
        <p style="margin: 0 0 4px; font-size: 18px; font-weight: 600;">${dateFormatted}</p>
        <p style="margin: 0 0 4px; font-size: 16px;">${booking.startTime} – ${booking.endTime}</p>
        <p style="margin: 0; font-size: 16px;">${pkg?.emoji ?? ""} ${pkg?.name ?? booking.package} pakket — ${pkg?.priceLabel ?? ""}</p>
      </div>

      <p style="color: #666; line-height: 1.6;">
        Heb je vragen? Neem contact op via
        <a href="mailto:hey.noona@outlook.com">hey.noona@outlook.com</a>
        of stuur ons een DM op Instagram
        <a href="https://instagram.com/heynoona.nl">@heynoona.nl</a>.
      </p>

      <p style="margin-top: 32px; font-size: 14px; color: #aaa;">Tot snel!<br>Team HeyNoona</p>
    </body>
    </html>
  `;
}

export async function sendBookingEmails(booking: Booking): Promise<void> {
  const transporter = getTransporter();
  if (!transporter) {
    console.warn(
      "[HeyNoona] SMTP not configured — booking saved but no email sent."
    );
    return;
  }

  const adminEmail = process.env.ADMIN_EMAIL ?? process.env.SMTP_USER;
  const fromEmail = process.env.SMTP_FROM ?? process.env.SMTP_USER;
  const pkg = getPackageById(booking.package as PackageId);

  if (!adminEmail || !fromEmail) return;

  await transporter.sendMail({
    from: `"HeyNoona Bookings" <${fromEmail}>`,
    to: adminEmail,
    subject: `Nieuwe boeking: ${booking.name} — ${formatDateNL(booking.date)}`,
    html: buildAdminEmailHtml(booking),
  });

  await transporter.sendMail({
    from: `"HeyNoona" <${fromEmail}>`,
    to: booking.email,
    subject: `Boeking bevestigd — HeyNoona ${pkg?.name ?? ""} pakket`,
    html: buildCustomerEmailHtml(booking),
  });
}
