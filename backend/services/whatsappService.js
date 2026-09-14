const twilio = require("twilio");

const {
  TWILIO_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_WHATSAPP_FROM,
} = process.env;

let client = null;

if (TWILIO_SID && TWILIO_AUTH_TOKEN) {
  client = twilio(TWILIO_SID, TWILIO_AUTH_TOKEN);
}

async function sendEmergencyWhatsApp({
  to,
  userName = "TrailGuard user",
  latitude,
  longitude,
}) {
  if (!client) {
    throw new Error("Twilio is not configured");
  }

  if (!to) {
    throw new Error("Emergency contact phone number is missing");
  }

  if (!TWILIO_WHATSAPP_FROM) {
    throw new Error("TWILIO_WHATSAPP_FROM is not configured");
  }

  const locationText =
    latitude != null && longitude != null
      ? `https://maps.google.com/?q=${latitude},${longitude}`
      : "Location unavailable";

  const body =
    `TRAILGUARD SOS: ${userName} needs help. ` +
    `Location: ${locationText}`;

  const message = await client.messages.create({
    from: TWILIO_WHATSAPP_FROM,
    to: `whatsapp:${to}`,
    body,
  });

  console.log(
    `[WhatsApp] Emergency message sent. SID: ${message.sid}`,
  );

  return {
    success: true,
    sid: message.sid,
  };
}

module.exports = {
  sendEmergencyWhatsApp,
};