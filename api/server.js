const express = require("express");
const cors = require("cors");
const vendorRouter = require("./routes/route");
const sequelize = require("./utils/sequelize");
const cluster = require("cluster");
const noOfCpus = require("os").availableParallelism();

/* 
Create the multiple cluster using cluster module of nodejs
based on no of cpu available in server machine
*/

if (cluster.isMaster) {
  for (let i = 0; i < noOfCpus; i++) {
    cluster.fork();
  }
} else {
  const app = express();
  app.use(
    cors({
      origin: "http://localhost:5173",
    })
  );

  //All Routes
  app.use(vendorRouter);

  //Connect to Databse
  sequelize;

  app.listen(4000, () => {
    console.log("server is running on port 4000", process.pid);
  });
}
