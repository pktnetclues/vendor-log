const express = require("express");
const getVendors = require("../controller/getVendors");
const insertData = require("../controller/insertData");
const getStatus = require("../controller/getStatus");

const vendorRouter = express.Router();

vendorRouter.route("/vendors").get(getVendors);

vendorRouter.route("/insert/:vendor_name").get(insertData);

vendorRouter.route("/getstatus").get(getStatus);

module.exports = vendorRouter;
