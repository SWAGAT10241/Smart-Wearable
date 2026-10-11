const { sendEmergencySMS } = require("./smsService");
const { sendEmergencyWhatsApp } = require("./whatsappService");

/**
 * Dispatch emergency SMS and WhatsApp notifications in parallel.
 *
 * @param {object} params
 * @param {string} params.to - Emergency contact phone number
 * @param {string} params.userName - Name of user triggering the alert
 * @param {number} [params.latitude] - GPS latitude
 * @param {number} [params.longitude] - GPS longitude
 * @returns {Promise<{sms: boolean, whatsapp: boolean}>}
 */
async function dispatchEmergencyAlerts({ to, userName, latitude, longitude }) {
  if (!to) return { sms: false, whatsapp: false };

  const results = { sms: false, whatsapp: false };

  // Trigger SMS
  try {
    await sendEmergencySMS({
      to,
      userName,
      latitude,
      longitude,
    });
    results.sms = true;
  } catch (error) {
    console.error("[SMS] Failed to send emergency SMS:", error.message);
  }

  // Trigger WhatsApp
  try {
    await sendEmergencyWhatsApp({
      to,
      userName,
      latitude,
      longitude,
    });
    results.whatsapp = true;
  } catch (error) {
    console.error("[WhatsApp] Failed to send emergency WhatsApp:", error.message);
  }

  return results;
}

module.exports = {
  dispatchEmergencyAlerts,
};
