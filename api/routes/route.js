const express = require("express")
const getVendors = require("../controller/getVendors")
const insertData = require("../controller/insertData")

const vendorRouter = express.Router()

vendorRouter.route("/vendors").get(getVendors)

vendorRouter.route("/insert/:vendor_name").get(insertData)


module.exports = vendorRouter