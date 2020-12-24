require("dotenv").config();

module.exports = JSON.parse(process.env.DATABASE_CONNECTION);
