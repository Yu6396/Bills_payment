const axios = require("axios");

const vtpass = axios.create({
  baseURL: process.env.VTPASS_BASE_URL,
  headers: {
    "api-key": process.env.VTPASS_API_KEY,
    "secret-key": process.env.VTPASS_SECRET_KEY,
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

async function handleRequest(endpoint, payload, action) {
  try {
    const { data } = await vtpass.post(endpoint, payload);

    return {
      success: true,
      data,
    };
  } catch (err) {
    console.error(
      `VTpass ${action} Error:`,
      err.response?.data || err.message
    );

    return {
      success: false,
      message:
        err.response?.data?.response_description ||
        `${action} failed`,
      error: err.response?.data || err.message,
    };
  }
}

async function buyAirtime({
  requestId,
  phone,
  amount,
  network,
}) {
  return handleRequest(
    "/pay",
    {
      request_id: requestId,
      amount,
      phone,
      serviceID: network,
    },
    "Airtime"
  );
}

async function buyData({
  requestId,
  network,
  phone,
  variationCode,
}) {
  return handleRequest(
    "/pay",
    {
      request_id: requestId,
      serviceID: network,
      phone,
      variation_code: variationCode,
    },
    "Data"
  );
}

// async function payElectricity({
//   requestId,
//   disco,
//   meterNo,
//   type,
//   amount,
//   phone,
// }) {
//   return handleRequest(
//     "/pay",
//     {
//       request_id: requestId,
//       serviceID: disco,
//       billersCode: meterNo,
//       variation_code: type,
//       amount,
//       phone,
//     },
//     "Electricity"
//   );
// }
async function payElectricity({
  requestId,
  disco,
  meterNo,
  type,
  amount,
  phone,
}) {
  const payload = {
    request_id: requestId,
    serviceID: disco,
    billersCode: meterNo,
    variation_code: type,
    amount,
    phone,
  };

  console.log("⚡ VTpass ELECTRICITY PAYLOAD:", payload);

  return handleRequest(
    "/pay",
    payload,
    "Electricity"
  );
}

async function payTV({
  requestId,
  provider,
  smartCard,
  variationCode,
  phone,
}) {
  return handleRequest(
    "/pay",
    {
      request_id: requestId,
      serviceID: provider,
      billersCode: smartCard,
      variation_code: variationCode,
      phone,
    },
    "TV"
  );
}

async function requery(requestId) {
  return handleRequest(
    "/requery",
    {
      request_id: requestId,
    },
    "Requery"
  );
}

/**
 * Generic GET helper
 */
async function _get(endpoint, params, action) {
  try {
    const { data } = await vtpass.get(endpoint, {
      params,
    });

    return {
      success: true,
      data,
    };
  } catch (err) {
    console.error(
      `VTpass ${action} Error:`,
      err.response?.data || err.message
    );

    return {
      success: false,
      message:
        err.response?.data?.response_description ||
        `${action} failed`,
      error: err.response?.data || err.message,
    };
  }
}

/**
 * Generic POST helper
 */
async function _post(endpoint, body, action) {
  try {
    const { data } = await vtpass.post(endpoint, body);

    return {
      success: true,
      data,
    };
  } catch (err) {
    console.error(
      `VTpass ${action} Error:`,
      err.response?.data || err.message
    );

    return {
      success: false,
      message:
        err.response?.data?.response_description ||
        `${action} failed`,
      error: err.response?.data || err.message,
    };
  }
}

/**
 * Get VTpass service variations
 */
async function getProducts({ serviceID }) {
  return _get(
    "/service-variations",
    { serviceID },
    "Get Products"
  );
}

/**
 * Verify electricity meter
 */
async function verifyElectricity({
  serviceID,
  meterNo,
  meterType,
}) {
  return _post(
    "/merchant-verify",
    {
      billersCode: meterNo,
      serviceID,
      type: meterType,
    },
    "Electricity Verification"
  );
}

/**
 * Verify TV smartcard
 */
async function verifyTV({
  serviceID,
  smartCard,
}) {
  return _post(
    "/merchant-verify",
    {
      billersCode: smartCard,
      serviceID,
    },
    "TV Verification"
  );
}

module.exports = {
  buyAirtime,
  buyData,
  payElectricity,
  payTV,
  requery,

  getProducts,

  verifyElectricity,
  verifyTV,

  _post,
  _get,
};