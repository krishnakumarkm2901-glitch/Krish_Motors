import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import useServices from "../hooks/useServices";
import { useAuth } from "../context/AuthContext";
import { BOOKINGS_KEY, makeId, readJson, writeJson } from "../utils/storage";
import "./BookService.css";

const initialForm = (preselected) => ({
  name: "",
  phone: "",
  bikeBrand: "",
  bikeModel: "",
  regNumber: "",
  serviceId: preselected || "",
  date: "",
});

export default function BookService() {
  const services = useServices();
  const { user } = useAuth();
  const location = useLocation();
  const preselected = location.state?.serviceId || "";

  const [form, setForm] = useState({
    ...initialForm(preselected),
    name: user?.name || "",
    phone: user?.phone || "",
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Please enter your name.";
    } else if (form.name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters.";
    }

    if (!form.phone.trim()) {
      newErrors.phone = "Please enter your phone number.";
    } else if (!/^[6-9]\d{9}$/.test(form.phone.trim())) {
      newErrors.phone = "Enter a valid 10-digit mobile number.";
    }

    if (!form.bikeBrand.trim()) {
      newErrors.bikeBrand = "Please enter your bike brand.";
    }

    if (!form.bikeModel.trim()) {
      newErrors.bikeModel = "Please enter your bike model.";
    }

    if (!form.regNumber.trim()) {
      newErrors.regNumber = "Please enter the registration number.";
    }

    if (!form.serviceId) {
      newErrors.serviceId = "Please select a service.";
    }

    if (!form.date) {
      newErrors.date = "Please choose a preferred date.";
    } else if (form.date < today) {
      newErrors.date = "Date cannot be in the past.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const booking = {
      id: makeId(),
      ...form,
      userId: user.id,
      userEmail: user.email,
      status: "Pending",
      serviceName:
        services.find((s) => s.id === form.serviceId)?.name || form.serviceId,
      bookedAt: new Date().toISOString(),
    };

    const existing = readJson(BOOKINGS_KEY, []);
    writeJson(BOOKINGS_KEY, [...existing, booking]);

    setSubmitted(true);
    setForm({ ...initialForm(""), name: user.name, phone: user.phone || "" });
  };

  const handleNewBooking = () => setSubmitted(false);

  return (
    <div className="book-page">
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">Reserve A Slot</span>
          <h1>Book a Service</h1>
          <p>
            Fill in your details below and our team will confirm your slot
            shortly.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="booking-wrap">
            {submitted ? (
              <div className="success-box">
                <div className="success-icon">&#10003;</div>
                <h2>Service Booked Successfully!</h2>
                <p>
                  We've received your request. Our team will call you to
                  confirm the appointment.
                </p>
                <button className="btn btn-primary" onClick={handleNewBooking}>
                  Book Another Service
                </button>
              </div>
            ) : (
              <form className="booking-form" onSubmit={handleSubmit} noValidate>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Customer Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="e.g. Arun Kumar"
                      value={form.name}
                      onChange={handleChange}
                    />
                    {errors.name && <span className="error">{errors.name}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      placeholder="10-digit mobile number"
                      value={form.phone}
                      onChange={handleChange}
                    />
                    {errors.phone && <span className="error">{errors.phone}</span>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="bikeBrand">Bike Brand</label>
                    <input
                      type="text"
                      id="bikeBrand"
                      name="bikeBrand"
                      placeholder="e.g. Honda, TVS, Royal Enfield"
                      value={form.bikeBrand}
                      onChange={handleChange}
                    />
                    {errors.bikeBrand && (
                      <span className="error">{errors.bikeBrand}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="bikeModel">Bike Model</label>
                    <input
                      type="text"
                      id="bikeModel"
                      name="bikeModel"
                      placeholder="e.g. Activa 6G"
                      value={form.bikeModel}
                      onChange={handleChange}
                    />
                    {errors.bikeModel && (
                      <span className="error">{errors.bikeModel}</span>
                    )}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="regNumber">Registration Number</label>
                    <input
                      type="text"
                      id="regNumber"
                      name="regNumber"
                      placeholder="e.g. TN 09 AB 1234"
                      value={form.regNumber}
                      onChange={handleChange}
                    />
                    {errors.regNumber && (
                      <span className="error">{errors.regNumber}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="serviceId">Select Service</label>
                    <select
                      id="serviceId"
                      name="serviceId"
                      value={form.serviceId}
                      onChange={handleChange}
                    >
                      <option value="">Choose a service</option>
                      {services.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} — ₹{s.price}
                        </option>
                      ))}
                    </select>
                    {errors.serviceId && (
                      <span className="error">{errors.serviceId}</span>
                    )}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="date">Preferred Date</label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      min={today}
                      value={form.date}
                      onChange={handleChange}
                    />
                    {errors.date && <span className="error">{errors.date}</span>}
                  </div>
                </div>

                <button type="submit" className="btn btn-primary btn-block">
                  Submit Booking
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
