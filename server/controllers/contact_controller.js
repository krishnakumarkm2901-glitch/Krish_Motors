const Contact = require("../models/contact");
const { hasMissingFields } = require("../utils/helpers");

async function createContact(request, response) {
  if (hasMissingFields(request.body, ["name", "email", "message"])) {
    return response.status(400).json({ message: "Name, email, and message are required." });
  }

  const message = await Contact.create({
    userId: request.user ? request.user.id : null,
    name: request.body.name.trim(),
    email: request.body.email.trim().toLowerCase(),
    message: request.body.message.trim(),
  });

  return response.status(201).json({ message });
}

module.exports = { createContact };
