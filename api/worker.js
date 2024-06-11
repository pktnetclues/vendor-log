const { parentPort, workerData } = require("worker_threads");
const xlsx = require("xlsx");
const fs = require("fs");
const sequelize = require("./utils/sequelize");
const { QueryTypes } = require("sequelize");

const processFile = async ({ vendor_name, filepath }) => {
  try {
    var total_inserted = 0;
    var total_skipped = 0;
    var total_updated = 0;

    const errorQuery = `INSERT INTO process_status (vendor_name, status, total_inserted, total_updated, total_skipped) VALUES (?,?,?,?,?)`;
    const errorReplacement = [
      vendor_name,
      "failed",
      total_inserted,
      total_updated,
      total_skipped,
    ];

    if (!fs.existsSync(filepath)) {
      await sequelize.query(errorQuery, {
        replacements: errorReplacement,
        type: QueryTypes.INSERT,
      });
      parentPort.postMessage({
        status: "error",
        message: "product file does not exist",
      });
      return;
    }

    const workbook = xlsx.readFile(filepath);
    const sheetName = workbook.SheetNames[0];
    const sheet = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    if (sheet.length === 0) {
      await sequelize.query(errorQuery, {
        replacements: errorReplacement,
        type: QueryTypes.INSERT,
      });
      parentPort.postMessage({
        status: "error",
        message: "no products found in file",
      });
      return;
    }

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
            total_inserted += 1;
            parentPort.postMessage({ status: "inserted", data: row });
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
              total_updated += 1;
              parentPort.postMessage({ status: "updated", data: row });
            });
        } else {
          total_skipped += 1;
          parentPort.postMessage({ status: "skipped", data: row });
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

    parentPort.postMessage({ status: "done" });
  } catch (error) {
    const errorQuery = `INSERT INTO process_status (vendor_name, status, total_inserted, total_updated, total_skipped) VALUES (?,?,?,?,?)`;
    const errorReplacement = [
      vendor_name,
      "failed",
      total_inserted,
      total_updated,
      total_skipped,
    ];

    await sequelize.query(errorQuery, {
      replacements: errorReplacement,
      type: QueryTypes.INSERT,
    });
    console.error("Error:", error);
    parentPort.postMessage({
      status: "error",
      message: "Internal server error",
    });
  }
};

processFile(workerData);
