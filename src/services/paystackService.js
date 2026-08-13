const axios = require("axios");
const { v4: uuidv4 } = require("uuid");

const intializePayment = async (email, amount) => {
  return axios({
    method: "POST",
    url: "https://api.paystack.co/transaction/initialize",
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    data: {
      email,
      amount: amount * 100,
      currency: "NGN",
    },
  });
};

const verifyPayment = async (reference) => {
  return axios({
    method: "GET",
    url: `https://api.paystack.co/transaction/verify/${reference}`,
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
  });
}

module.exports = {
  intializePayment,
  verifyPayment,
};
