import { Resend } from "resend";
import type { Booking } from "./db";

import { getPackageById, formatDateNL, type PackageId } from "./packages";

function getResend() {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return null;
  }

  return new Resend(apiKey);
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function getEmailConfig() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const fromEmail =
    process.env.RESEND_FROM ?? "HeyNoona <onboarding@resend.dev>";

  return { adminEmail, fromEmail };
}

function buildAdminEmailHtml(
  booking: Booking,
  opts?: { heading?: string; intro?: string }
): string {
  const pkg = getPackageById(booking.package as PackageId);
  const dateFormatted = formatDateNL(booking.date);
  const fullName = `${booking.firstName} ${booking.lastName}`;

  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family: Inter, sans-serif; color: #111; max-width: 600px; margin: 0 auto; padding: 32px;">
      <h1 style="font-size: 24px; margin-bottom: 8px;">
        ${opts?.heading ?? "Nieuwe boeking — HeyNoona"}
      </h1>

      <p style="color: #666; margin-bottom: 32px;">
        ${opts?.intro ?? "Er is een nieuwe photobooth boeking binnengekomen."}
      </p>

      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #888; width: 140px;">Datum</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #eee; font-weight: 600;">
            ${dateFormatted}
          </td>
        </tr>

        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #888;">Tijd</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #eee; font-weight: 600;">
            ${booking.startTime} – ${booking.endTime}
          </td>
        </tr>

        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #888;">Pakket</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #eee; font-weight: 600;">
            ${pkg?.emoji ?? ""} ${pkg?.name ?? booking.package} (${pkg?.priceLabel ?? ""})
          </td>
        </tr>

        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #888;">Evenement</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #eee;">
            ${escapeHtml(booking.eventType)}
          </td>
        </tr>

        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #888;">Naam</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #eee;">
            ${escapeHtml(fullName)}
          </td>
        </tr>

        ${
          booking.company
            ? `
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #888;">Bedrijf</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #eee;">
            ${escapeHtml(booking.company)}
          </td>
        </tr>
        `
            : ""
        }

        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #888;">E-mail</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #eee;">
            <a href="mailto:${escapeHtml(booking.email)}">
              ${escapeHtml(booking.email)}
            </a>
          </td>
        </tr>

        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #888;">Telefoon</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #eee;">
            <a href="tel:${escapeHtml(booking.phone)}">
              ${escapeHtml(booking.phone)}
            </a>
          </td>
        </tr>

        ${
          booking.address
            ? `
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #888; vertical-align: top;">
            Adres
          </td>
          <td style="padding: 12px 0; border-bottom: 1px solid #eee;">
            ${escapeHtml(booking.address)}
            ${
              booking.postalCode
                ? `, ${escapeHtml(booking.postalCode)}`
                : ""
            }
            ${booking.city ? ` ${escapeHtml(booking.city)}` : ""}
          </td>
        </tr>
        `
            : ""
        }

        ${
          booking.message
            ? `
        <tr>
          <td style="padding: 12px 0; color: #888; vertical-align: top;">
            Opmerkingen
          </td>
          <td style="padding: 12px 0;">
            ${escapeHtml(booking.message)}
          </td>
        </tr>
        `
            : ""
        }
      </table>

      <p style="margin-top: 32px; font-size: 12px; color: #aaa;">
        Boeking ID: ${escapeHtml(booking.id)}
      </p>
    </body>
    </html>
  `;
}

function buildCustomerEmailHtml(
  booking: Booking,
  variant: "confirmation" | "cancellation" | "reminder" = "confirmation"
): string {
  const pkg = getPackageById(booking.package as PackageId);
  const dateFormatted = formatDateNL(booking.date);

  const copy = {
    confirmation: {
      title: `Bedankt, ${escapeHtml(booking.firstName)}! 🫧`,
      intro:
        "Je boeking bij HeyNoona is bevestigd. We kijken ernaar uit!",
    },
    reminder: {
      title: `Bijna zo ver, ${escapeHtml(booking.firstName)}! 🫧`,
      intro:
        "Een korte herinnering aan je aankomende photobooth-boeking bij HeyNoona.",
    },
    cancellation: {
      title: `Boeking geannuleerd`,
      intro: `Hoi ${escapeHtml(
        booking.firstName
      )}, je boeking bij HeyNoona is geannuleerd. Neem gerust contact op als je vragen hebt of opnieuw wilt boeken.`,
    },
  }[variant];

  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family: Inter, sans-serif; color: #111; max-width: 600px; margin: 0 auto; padding: 32px;">

      <h1 style="font-size: 28px; margin-bottom: 8px;">
        ${copy.title}
      </h1>

      <p style="color: #666; margin-bottom: 32px;">
        ${copy.intro}
      </p>

      <div style="background: #FFF8F7; border-radius: 16px; padding: 24px; margin-bottom: 24px;">
        <p style="margin: 0 0 8px; font-size: 14px; color: #888; text-transform: uppercase; letter-spacing: 0.1em;">
          Jouw boeking
        </p>

        <p style="margin: 0 0 4px; font-size: 18px; font-weight: 600;">
          ${dateFormatted}
        </p>

        <p style="margin: 0 0 4px; font-size: 16px;">
          ${booking.startTime} – ${booking.endTime}
        </p>

        <p style="margin: 0; font-size: 16px;">
          ${pkg?.emoji ?? ""} ${pkg?.name ?? booking.package} pakket — ${pkg?.priceLabel ?? ""}
        </p>
      </div>

      <p style="color: #666; line-height: 1.6;">
        Heb je vragen? Neem contact op via
        <a href="mailto:hey.noona@outlook.com">
          hey.noona@outlook.com
        </a>
        of stuur ons een DM op Instagram
        <a href="https://instagram.com/heynoona.nl">
          @heynoona.nl
        </a>.
      </p>

      <p style="margin-top: 32px; font-size: 14px; color: #aaa;">
        Tot snel!<br>
        Team HeyNoona
      </p>

    </body>
    </html>
  `;
}

export async function sendBookingEmails(
  booking: Booking
): Promise<void> {
  const resend = getResend();

  if (!resend) {
    console.error(
      "[HeyNoona] RESEND_API_KEY ontbreekt — booking saved but no email sent."
    );
    return;
  }

  const { adminEmail, fromEmail } = getEmailConfig();
  const pkg = getPackageById(booking.package as PackageId);
  const fullName = `${booking.firstName} ${booking.lastName}`;

  if (!adminEmail) {
    console.error(
      "[HeyNoona] ADMIN_EMAIL ontbreekt — admin email niet verzonden."
    );
    return;
  }

  if (!fromEmail) {
    console.error(
      "[HeyNoona] RESEND_FROM ontbreekt — email niet verzonden."
    );
    return;
  }

  const adminResult = await resend.emails.send({
    from: fromEmail,
    to: adminEmail,
    subject: `Nieuwe boeking: ${fullName} — ${formatDateNL(
      booking.date
    )}`,
    html: buildAdminEmailHtml(booking),
  });

  if (adminResult.error) {
    console.error(
      "[HeyNoona] Fout bij verzenden admin email:",
      adminResult.error
    );
    throw new Error(
      `Admin email kon niet worden verzonden: ${adminResult.error.message}`
    );
  }

  const customerResult = await resend.emails.send({
    from: fromEmail,
    to: booking.email,
    subject: `Boeking bevestigd — HeyNoona ${
      pkg?.name ?? ""
    } pakket`,
    html: buildCustomerEmailHtml(booking, "confirmation"),
  });

  if (customerResult.error) {
    console.error(
      "[HeyNoona] Fout bij verzenden klant email:",
      customerResult.error
    );
    throw new Error(
      `Klant email kon niet worden verzonden: ${customerResult.error.message}`
    );
  }
}

// Onderstaande functies worden gebruikt vanuit het beheerdersdashboard.

export async function resendConfirmationEmail(
  booking: Booking
): Promise<void> {
  const resend = getResend();

  if (!resend) {
    throw new Error("RESEND_API_KEY ontbreekt.");
  }

  const { fromEmail } = getEmailConfig();

  if (!fromEmail) {
    throw new Error("RESEND_FROM ontbreekt.");
  }

  const pkg = getPackageById(booking.package as PackageId);

  const result = await resend.emails.send({
    from: fromEmail,
    to: booking.email,
    subject: `Boeking bevestigd — HeyNoona ${
      pkg?.name ?? ""
    } pakket`,
    html: buildCustomerEmailHtml(booking, "confirmation"),
  });

  if (result.error) {
    throw new Error(
      `Bevestigingsmail kon niet worden verzonden: ${result.error.message}`
    );
  }
}

export async function sendCancellationEmail(
  booking: Booking
): Promise<void> {
  const resend = getResend();

  if (!resend) {
    throw new Error("RESEND_API_KEY ontbreekt.");
  }

  const { fromEmail } = getEmailConfig();

  if (!fromEmail) {
    throw new Error("RESEND_FROM ontbreekt.");
  }

  const result = await resend.emails.send({
    from: fromEmail,
    to: booking.email,
    subject: `Boeking geannuleerd — HeyNoona`,
    html: buildCustomerEmailHtml(booking, "cancellation"),
  });

  if (result.error) {
    throw new Error(
      `Annuleringsmail kon niet worden verzonden: ${result.error.message}`
    );
  }
}

export async function sendReminderEmail(
  booking: Booking
): Promise<void> {
  const resend = getResend();

  if (!resend) {
    throw new Error("RESEND_API_KEY ontbreekt.");
  }

  const { fromEmail } = getEmailConfig();

  if (!fromEmail) {
    throw new Error("RESEND_FROM ontbreekt.");
  }

  const result = await resend.emails.send({
    from: fromEmail,
    to: booking.email,
    subject: `Herinnering: jouw HeyNoona boeking op ${formatDateNL(
      booking.date
    )}`,
    html: buildCustomerEmailHtml(booking, "reminder"),
  });

  if (result.error) {
    throw new Error(
      `Herinneringsmail kon niet worden verzonden: ${result.error.message}`
    );
  }
}