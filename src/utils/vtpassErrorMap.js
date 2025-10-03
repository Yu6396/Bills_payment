// vtpassErrorMap.js
const vtpassErrorMap = {
  "000": "✅ Transaction successful",
  "016": "❌ Transaction could not be completed. Please try again or contact support.",
  "028": "⚠️ This product is not enabled on your account. Please contact support.",
  "099": "⚠️ Invalid customer details (phone, smartcard, or meter number).",
  "100": "❌ Your wallet balance is too low to complete this transaction.",
  "102": "⚠️ The amount entered is invalid for this product.",
  "104": "⚠️ Duplicate transaction detected. Please wait for the first one to complete.",
  "105": "⚠️ Service temporarily unavailable. Please try again later.",

  // Cable TV
  "110": "⚠️ Invalid TV subscription package. Please select a valid one.",
  "111": "⚠️ The smartcard number entered is invalid.",
  "112": "⚠️ Unable to verify your smartcard number. Please confirm and try again.",

  // Electricity
  "120": "⚠️ Invalid electricity meter number. Please confirm and try again.",
  "121": "⚠️ This meter number is not registered. Please contact your electricity provider.",
  "122": "❌ Failed to generate electricity token. Please try again.",

  // Data
  "130": "⚠️ Invalid data bundle selected. Please check the options.",
  "131": "❌ Data bundle activation failed. Please try again later.",

  // General
  "999": "❌ An error occurred on VTpass. Please try again later."
};

function getFriendlyMessage(code, defaultMsg) {
  return vtpassErrorMap[code] || `Transaction failed: ${defaultMsg || "Unknown error"}`;
}

module.exports = { getFriendlyMessage };
