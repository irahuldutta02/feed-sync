const cron = require("cron");
const axios = require("axios");
const mongoose = require("mongoose");
const { SERVER_URL } = require("../config/serverConfig");

const job = new cron.CronJob("*/5 * * * *", async function () {
  try {
    const res = await axios.get(SERVER_URL);
    if (res.status === 200) {
      console.log("GET request sent successfully");
    } else {
      console.log("GET request failed", res.status);
    }

    const totalCollections = await mongoose.connection.db
      .listCollections()
      .toArray();
    console.log("Total Mongoose Collections:", totalCollections.length);
  } catch (e) {
    console.error("Error while sending request", e.message || e);
  }
});

module.exports = { job };
