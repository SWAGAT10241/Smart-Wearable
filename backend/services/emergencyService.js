const { sendEmergencySMS } = require("./smsService");
const { sendEmergencyWhatsApp } = require("./whatsappService");
const logger = require("../utils/logger");

/**
 * Dispatch emergency alerts (SMS and WhatsApp) to a contact.
 *
 * @param {object} params
 * @param {string} params.to - Emergency recipient phone number
 * @param {string} params.userName - Name of user in distress
 * @param {number} [params.latitude] - GPS latitude
 * @param {number} [params.longitude] - GPS longitude
 */
async function dispatchEmergencyAlerts({ to, userName, latitude, longitude }) {
  if (!to) return;

  const results = {
    sms: null,
    whatsapp: null,
  };

  try {
    results.sms = await sendEmergencySMS({
      to,
      userName,
      latitude,
      longitude,
    });
  } catch (smsError) {
    logger.error("[SMS] Failed to send emergency SMS:", smsError.message);
  }

  try {
    results.whatsapp = await sendEmergencyWhatsApp({
      to,
      userName,
      latitude,
      longitude,
    });
  } catch (whatsappError) {
    logger.error("[WhatsApp] Failed to send emergency WhatsApp:", whatsappError.message);
  }

  return results;
}

module.exports = {
  dispatchEmergencyAlerts,
};
