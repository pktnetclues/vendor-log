const { Worker } = require("worker_threads");
const path = require("path");

const insertData = (req, res) => {
  const vendor_name = req.params.vendor_name;
  const filepath = path.resolve(
    __dirname,
    `../vendors/${vendor_name}/products.xlsx`
  );

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const worker = new Worker(path.resolve(__dirname, "../worker.js"), {
    workerData: { vendor_name, filepath },
  });

  worker.on("message", (message) => {
    if (message.status === "error") {
      res.write(`data: ${JSON.stringify({ message: message.message })}\n\n`);
    } else if (message.status === "inserted") {
      res.write(
        `data: ${JSON.stringify({
          message: "Inserted",
          data: message.data,
        })}\n\n`
      );
    } else if (message.status === "updated") {
      res.write(
        `data: ${JSON.stringify({
          message: "Updated",
          data: message.data,
        })}\n\n`
      );
    } else if (message.status === "skipped") {
      res.write(
        `data: ${JSON.stringify({
          message: "Skipped",
          data: message.data,
        })}\n\n`
      );
    } else if (message.status === "done") {
      res.end();
    }
  });

  worker.on("error", (error) => {
    console.error("Worker error:", error);
    res.status(500).json({ message: "Internal server error" });
  });
};

module.exports = insertData;
