const prod = process.env.NODE_ENV === "production";

module.exports = {
  mode: "development",
  devtool: "source-map",
  optimization: { minimize: prod },
  externals: [
    {
      knex: "knex",
      webpack: "webpack"
    },
  ],
};
