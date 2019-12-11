"use strict";

module.exports.index = async event => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Go Serverless v1.0! Your function executed successfully!",
      input: event
    }),
    headers: {
      "Access-Control-Allow-Origin": "*"
    }
  };
};
