const crypto = require("crypto");

function hasMissingFields(body, fields) {
  return fields.some((field) => !String(body[field] || "").trim());
}

function makeServiceId() {
  return `service-${crypto.randomBytes(6).toString("hex")}`;
}

function asyncHandler(handler) {
  return function handleAsyncRequest(request, response, next) {
    Promise.resolve(handler(request, response, next)).catch(next);
  };
}

module.exports = { hasMissingFields, makeServiceId, asyncHandler };
