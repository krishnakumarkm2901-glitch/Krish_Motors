const Service = require("../models/service");
const { hasMissingFields, makeServiceId } = require("../utils/helpers");

async function listServices(_request, response) {
  const services = await Service.find().sort({ name: 1 });
  response.json({ services });
}

async function createService(request, response) {
  if (hasMissingFields(request.body, ["name", "description", "price"])) {
    return response.status(400).json({ message: "Name, description, and price are required." });
  }

  const service = await Service.create({
    id: makeServiceId(),
    name: request.body.name.trim(),
    description: request.body.description.trim(),
    price: Number(request.body.price),
    image: request.body.image || "",
  });

  return response.status(201).json({ service });
}

async function updateService(request, response) {
  const service = await Service.findOne({ id: request.params.identifier });
  if (!service) return response.status(404).json({ message: "Service not found." });

  const allowedFields = ["name", "description", "price", "image"];
  allowedFields.forEach((field) => {
    if (request.body[field] !== undefined) service[field] = request.body[field];
  });
  await service.save();
  return response.json({ service });
}

async function deleteService(request, response) {
  const service = await Service.findOneAndDelete({ id: request.params.identifier });
  if (!service) return response.status(404).json({ message: "Service not found." });
  return response.status(204).send();
}

async function seedServices() {
  const defaults = [
    {
      id: "general-service", name: "General Service", price: 499,
      description: "Complete multi-point checkup and safety inspection.",
      image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "oil-change", name: "Oil Change", price: 349,
      description: "Premium engine oil and filter replacement.",
      image: "https://images.unsplash.com/photo-1635784063504-52b96c0a3078?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "brake-service", name: "Brake Service", price: 299,
      description: "Brake inspection, cleaning, adjustment, and fluid top-up.",
      image: "https://images.unsplash.com/photo-1615172282427-9a57ef2d142e?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "water-wash", name: "Water Wash", price: 149,
      description: "Exterior wash, degreasing, and polish.",
      image: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?auto=format&fit=crop&w=600&q=80",
    },
  ];

  await Promise.all(defaults.map((service) =>
    Service.updateOne({ id: service.id }, { $setOnInsert: service }, { upsert: true })
  ));
}

module.exports = { listServices, createService, updateService, deleteService, seedServices };
