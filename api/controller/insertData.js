const xlsx = require("xlsx");
const fs = require("fs");
const path = require("path");
const sequelize = require("../utils/sequelize");
const { QueryTypes } = require("sequelize");

const insertData = async (req, res) => {
  try {
    const vendor_name = req.params.vendor_name;
    var total_inserted = 0;
    var total_skipped = 0;
    var total_updated = 0;

    const filepath = path.resolve(
      __dirname,
      `../vendors/${vendor_name}/products.xlsx`
    );

    if (!fs.existsSync(filepath)) {
      await sequelize.query(
        `INSERT INTO process_status (vendor_name, status, total_inserted, total_updated, total_skipped) VALUES (?,?,?,?,?)`,
        {
          replacements: [
            vendor_name,
            "failed",
            total_inserted,
            total_updated,
            total_skipped,
          ],
          type: QueryTypes.INSERT,
        }
      );
      return res.status(400).json({ message: "product file does not exist" });
    }

    const workbook = xlsx.readFile(filepath);
    const sheetName = workbook.SheetNames[0];
    const sheet = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    if (sheet.length === 0) {
      await sequelize.query(
        `INSERT INTO process_status (vendor_name, status, total_inserted, total_updated, total_skipped) VALUES (?,?,?,?,?)`,
        {
          replacements: [
            vendor_name,
            "failed",
            total_inserted,
            total_updated,
            total_skipped,
          ],
          type: QueryTypes.INSERT,
        }
      );
      return res.status(404).json({ message: "no products found in file" });
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    for (const row of sheet) {
      const [existingProduct] = await sequelize.query(
        `SELECT * FROM products WHERE name = :name`,
        {
          replacements: { name: row.name },
          type: QueryTypes.SELECT,
        }
      );

      if (!existingProduct) {
        await sequelize
          .query(
            `INSERT INTO products (name, price, quantity) VALUES (:name, :price, :quantity)`,
            {
              replacements: {
                name: row.name,
                price: row.price,
                quantity: row.quantity,
              },
              type: QueryTypes.INSERT,
            }
          )
          .then(() => {
            total_inserted = total_inserted + 1;
            res.write(
              `data: ${JSON.stringify({ message: "Inserted", data: row })}\n\n`
            );
          });
      } else {
        if (
          existingProduct.price != row.price ||
          existingProduct.quantity != row.quantity
        ) {
          await sequelize
            .query(
              `UPDATE products SET price = :price, quantity = :quantity WHERE id = :id`,
              {
                replacements: {
                  price: row.price,
                  quantity: row.quantity,
                  id: existingProduct.id,
                },
                type: QueryTypes.UPDATE,
              }
            )
            .then(() => {
              total_updated = total_updated + 1;
              res.write(
                `data: ${JSON.stringify({
                  message: "Updated",
                  data: row,
                })}\n\n`
              );
            });
        } else {
          total_skipped = total_skipped + 1;

          res.write(
            `data: ${JSON.stringify({ message: "Skipped", data: row })}\n\n`
          );
        }
      }
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    await sequelize.query(
      `INSERT INTO process_status (vendor_name, status, total_inserted, total_updated, total_skipped) VALUES (?,?,?,?,?)`,
      {
        replacements: [
          vendor_name,
          "success",
          total_inserted,
          total_updated,
          total_skipped,
        ],
        type: QueryTypes.INSERT,
      }
    );

    res.end();
  } catch (error) {
    await sequelize.query(
      `INSERT INTO process_status (vendor_name, status, total_inserted, total_updated, total_skipped) VALUES (?,?,?,?,?)`,
      {
        replacements: [
          vendor_name,
          "failed",
          total_inserted,
          total_updated,
          total_skipped,
        ],
        type: QueryTypes.INSERT,
      }
    );
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = insertData;
