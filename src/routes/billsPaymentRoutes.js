const express = require("express");
const router = express.Router();
const {
  payAirtime,
  payData,
  payElectricity,
  payTV,
  requeryTransaction,
  getBillProviders,
  getBillProducts,
  verifyElectricityMeter,
  verifyTVSmartCard,
} = require("../controllers/billsPayment");
const { UserAuthorization } = require("../middlewares/authorization");

// Get all active providers
// Optional: ?category=airtime
// Optional: ?category=data
// Optional: ?category=electricity
// Optional: ?category=tv

router.post("/airtime", UserAuthorization, payAirtime);
router.post("/data", UserAuthorization, payData);
router.post("/electricity", UserAuthorization, payElectricity);
router.post("/tv", UserAuthorization, payTV);
router.get("/providers", getBillProviders);
router.get("/providers/:providerId/products", getBillProducts);
router.post("/electricity/verify", verifyElectricityMeter);
router.post("/tv/verify", verifyTVSmartCard);
router.get("/requery/:transaction_ref", UserAuthorization, requeryTransaction);

module.exports = router;
