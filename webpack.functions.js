module.exports = {
  devtool: process.env.NODE_ENV === "production" ? undefined : "eval",
  externals: [
    { knex: "knex" }
  ],
};
