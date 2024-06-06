const { QueryTypes } = require("sequelize");
const sequelize = require("../utils/sequelize");

const getStatus = async (req, res) => {
  try {
    const AllStatus = await sequelize.query(`SELECT * FROM process_status`, {
      type: QueryTypes.SELECT,
    });

    const SuccessLogs = AllStatus.filter((status) => {
      return status.status !== "failed";
    });

    const FailedLogs = AllStatus.filter((status) => {
      return status.status !== "success";
    });

    res.status(200).json({
      SuccessLogs: SuccessLogs,
      FailedLogs: FailedLogs,
    });
  } catch (error) {}
};

module.exports = getStatus;
