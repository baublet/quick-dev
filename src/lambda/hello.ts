require('@babel/polyfill/noConflict')
require("dotenv").config();

exports.handler = async function(event, context) {
  return {
      statusCode: 200,
      body: JSON.stringify({message: "Hello World"})
  };
}