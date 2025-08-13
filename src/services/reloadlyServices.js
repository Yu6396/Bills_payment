const axios = require("axios");

const getUitilityAccessToken = async () => {
  const url = "https://auth.reloadly.com/oauth/token";
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    data: {
      client_id: `${process.env.RELOADLY_CLIENT_ID}`,
      client_secret: `${process.env.RELOADLY_CLIENT_SECRET}`,
      grant_type: "client_credentials",
      audience: "https://utilities-sandbox.reloadly.com",
    },
  };
  const responseFromAxios = await axios(url, options);
  return responseFromAxios.data.access_token;
};

const getAirtimeAccessToken = async () => {
  const url = "https://auth.reloadly.com/oauth/token";
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    data: {
      client_id: `${process.env.RELOADLY_CLIENT_ID}`,
      client_secret: `${process.env.RELOADLY_CLIENT_SECRET}`,
      grant_type: "client_credentials",
      audience: "https://topups-sandbox.reloadly.com",
    },
  };
  const responseFromAxios = await axios(url, options);
  return responseFromAxios.data.access_token;
};

const getAllBillersCategory = async () => {
  const getToken = await getUitilityAccessToken();
  console.log("object", getToken)
  if (!getToken) {
    throw new Error("Failed to get access token");
  }
  try {
    const response = await axios({
      method: "get",
      url: `https://utilities-sandbox.reloadly.com/billers`,
      headers: {
        Authorization: `Bearer ${getToken}`,
        "Content-Type": "application/json",
      },
    });
    console.log("hey", response.data);
    return response.data.content;
  } catch (error) {
    console.log("Error reloadly service:", error.message);
    throw new Error(error.message);
  }
};

const purchaseUtilityBiller = async (
  billerID,
  amount,
  subscriberAccountNumber
) => {
  const getToken = await getUitilityAccessToken();
  if (!getToken) {
    throw new Error("Failed to get access token");
  }
  try {
    const response = await axios({
      method: "post",
      url: "https://utilities-sandbox.reloadly.com/pay",
      headers: {
        Authorization: `Bearer ${getToken}`,
        "Content-Type": "application/json",
      },

      data: {
        billerId: billerID,
        subscriberAccountNumber: subscriberAccountNumber,
        amount: amount,
      },
    });
    console.log("finding", response);
    return response.data;
  } catch (error) {
    console.log("Error reloadly service:", error.message);
    throw new Error(error.message);
  }
};

const getAllAirtimeOperator = async () => {
  const getToken = await getAirtimeAccessToken();
    console.log("airtime", getToken)
  if (!getToken) {
    throw new Error("Failed to get access token");
  }
  try {
    const response = await axios({
      method: "get",
      url: "https://topups-sandbox.reloadly.com/operators",
      headers: {
        Authorization: `Bearer ${getToken}`,
        "Content-Type": "application/json",
      },
    });
    console.log("hey", response.data.content);
    return response.data.content;
  } catch (error) {
    console.log("Error reloadly service:", error.message);
    throw new Error(error.message);
  }
};

const getAllCountriesOperators = async (countrycode = "NG" ) => {
    const getToken = await getAirtimeAccessToken();
    if (!getToken) {
      throw new Error("Failed to get access token");
    }
    try {
      const response = await axios({
        method: "get",
        url: `https://topups-sandbox.reloadly.com/operators/countries/${countrycode}`,
        headers: {
          Authorization: `Bearer ${getToken}`,
          "Content-Type": "application/json",
        },
      });
      return response?.data;
    } catch (error) {
      console.log("Error reloadly service:", error.message);
      throw new Error(error.message);
    }
  };


const purchaseAirtime = async (operatorId, amount, phone) => {
    const token = await getAirtimeAccessToken();
    if (!token) {
      throw new Error("Failed to get access token");
    }
  
    try {
      const response = await axios({
        method: "POST",
        url: "https://topups-sandbox.reloadly.com/topups",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/com.reloadly.topups-v1+json",
        },
        data: {
          operatorId,
          amount,
          useLocalAmount: true, // Use true to indicate NGN
          customIdentifier: `topup-${Date.now()}`,
          recipientPhone: {
            countryCode: "NG",
            number: phone,
          },
        },
      });
  
      return response.data;
    } catch (error) {
      console.error("Error reloadly service:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Failed to complete topup");
    }
  };

module.exports = {
  getAllBillersCategory,
  purchaseUtilityBiller,
  getAllAirtimeOperator,
  getAllCountriesOperators,
  purchaseAirtime
};
