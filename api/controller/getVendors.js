const fs = require('fs');
const path = require('path');

const getVendors = (req, res) => {
    const directoryPath = path.resolve(__dirname, '../vendors');

    fs.readdir(directoryPath, (err, vendors) => {
        res.status(200).json(vendors);
    });
}

module.exports = getVendors