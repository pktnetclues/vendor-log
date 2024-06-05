const xlsx = require('xlsx');
const fs = require("fs")
const path = require("path")

const insertData = async (req, res) => {
    const vendor_name = req.params.vendor_name

    const filepath = path.resolve(__dirname, `../vendors/${vendor_name}/products.xlsx`)

    if (!fs.existsSync(filepath)) {
        return res.status(400).json({ message: "product file does not exist" })
    }

    const workbook = xlsx.readFile(filepath);
    const sheetName = workbook.SheetNames[0];
    const sheet = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    if (sheet.length === 0) {
        return res.status(404).json({ message: "no products found in file" })
    }

    return res.status(200).json(sheet)
}

module.exports = insertData
