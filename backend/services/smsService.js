const twilio = require("twilio");

const { TWILIO_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER } = process.env;

let client = null;

if (TWILIO_SID && TWILIO_AUTH_TOKEN) {
  client = twilio(TWILIO_SID, TWILIO_AUTH_TOKEN);
}

async function sendEmergencySMS({
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

  let locationText = "Location unavailable";

  if (latitude != null && longitude != null) {
    const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

    locationText = mapsUrl;
  }

  const body =
    `TRAILGUARD SOS: ${userName} needs help. ` +
    (latitude != null && longitude != null
      ? `https://maps.google.com/?q=${latitude},${longitude}`
      : "Location unavailable");

  const message = await client.messages.create({
    body,
    from: TWILIO_PHONE_NUMBER,
    to,
  });

  console.log(`[SMS] Emergency SMS sent. SID: ${message.sid}`);

  return {
    success: true,
    sid: message.sid,
  };
}

module.exports = {
  sendEmergencySMS,
};
