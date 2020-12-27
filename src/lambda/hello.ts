require('@babel/polyfill/noConflict')
require("dotenv").config();
require('source-map-support').install();

exports.handler = async function(event, context) {
  return {
      statusCode: 200,
      body: JSON.stringify({message: "Hello World"})
  };
}