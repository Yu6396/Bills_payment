

const Router = require('express').Router();
const { PurchaseUtilityBills, GetAllUtilityBillers, GetAllAirtimeOperators, GetAllCountriesOperators, PurchaseAirtime} = require('../controllers/billsPayment');

Router.post("/buy-utility-bill/:billerID/:id", PurchaseUtilityBills)

Router.get("/get-all-Utility-billers", GetAllUtilityBillers) // get all utility billers

Router.get("/get-all-airtime-operators/", GetAllAirtimeOperators) // get all airtime operators

Router.get("/get-all-countries", GetAllCountriesOperators) // get all airtime operators

Router.get("/get-all-countries/:countrycode", GetAllCountriesOperators) // get all airtime operators

Router.post("/buy-airtime/:id", PurchaseAirtime) // purchase airtime 





module.exports = Router;