const axios = require("axios");

const vtpass = axios.create({
  baseURL: process.env.VTPASS_BASE_URL,
  auth: {
    username: process.env.VTPASS_EMAIL,
    password: process.env.VTPASS_PASSWORD,
  },
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

async function handleRequest(endpoint, payload, action) {
  try {
    const { data } = await vtpass.post(endpoint, payload);
    return { success: true, data };
  } catch (err) {
    console.error(`VTpass ${action} Error:`, err.response?.data || err.message);
    return {
      success: false,
      message: err.response?.data?.response_description || `${action} failed`,
      error: err.response?.data || err.message,
    };
  }
}

async function buyAirtime({ requestId, phone, amount, network }) {
  return handleRequest("/pay", {
    request_id: requestId,
    amount,
    phone,
    serviceID: network,
  }, "Airtime");
}

async function buyData({ requestId, network, phone, variationCode }) {
  return handleRequest("/pay", {
    request_id: requestId,
    serviceID: network,
    phone,
    variation_code: variationCode,
  }, "Data");
}

async function payElectricity({ requestId, disco, meterNo, type, amount, phone }) {
  return handleRequest("/pay", {
    request_id: requestId,
    serviceID: disco,
    billersCode: meterNo,
    variation_code: type, // prepaid/postpaid
    amount,
    phone,
  }, "Electricity");
}

async function payTV({ requestId, provider, smartCard, variationCode, phone }) {
  return handleRequest("/pay", {
    request_id: requestId,
    serviceID: provider,
    billersCode: smartCard,
    variation_code: variationCode,
    phone,
  }, "TV");
}

async function requery(requestId) {
  return handleRequest("/requery", { request_id: requestId }, "Requery");
}

module.exports = {
  buyAirtime,
  buyData,
  payElectricity,
  payTV,
  requery,
};
