const express = require("express");
const router = express.Router();
const {payAirtime, payData, payElectricity, payTV, requeryTransaction} = require("../controllers/billsPayment");
const {UserAuthorization }= require("../middlewares/authorization");

router.post("/airtime", UserAuthorization, payAirtime);
router.post("/data",UserAuthorization, payData);
router.post("/electricity", UserAuthorization, payElectricity);
router.post("/tv", UserAuthorization, payTV);
router.get("/requery/:transaction_ref", UserAuthorization, requeryTransaction);
module.exports = router;
