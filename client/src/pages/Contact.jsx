import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../utils/api";
import "./Contact.css";

const initialForm = { name: "", email: "", message: "" };

export default function Contact() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    ...initialForm,
    name: user?.name || "",
    email: user?.email || "",
  });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Please enter your name.";
    if (!form.email.trim()) {
      newErrors.email = "Please enter your email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      newErrors.email = "Enter a valid email address.";
    }
    if (!form.message.trim()) {
      newErrors.message = "Please enter a message.";
    } else if (form.message.trim().length < 10) {
      newErrors.message = "Message should be at least 10 characters.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await api("/contact", { method: "POST", body: JSON.stringify(form) });
      setSent(true);
      setForm({ ...initialForm, name: user?.name || "", email: user?.email || "" });
    } catch (error) {
      setErrors({ submit: error.message });
    }
  };

  return (
    <div className="contact-page">
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">Get In Touch</span>
          <h1>Contact Us</h1>
          <p>Have a question about your bike? Reach out — we're happy to help.</p>
        </div>
      </section>

      <section className="section">
        <div className="container contact-grid">
          <div className="contact-info">
            <h2>Visit Or Reach Us</h2>
            <ul>
              <li>
                <span className="label">Phone</span>
                <span>+91 88074 36007</span>
              </li>
              <li>
                <span className="label">Email</span>
                <span>krishnakumarkm2901@gmail.com</span>
              </li>
              <li>
                <span className="label">Workshop Address</span>
                <span>119/15, Pudhu Kadu Bagam, Pampadumpara, Idukki, Kerala</span>
              </li>
              <li>
                <span className="label">Working Hours</span>
                <span>Mon – Sat, 9:00 AM – 7:00 PM</span>
              </li>
            </ul>
          </div>

          <div className="contact-form-wrap">
            {sent ? (
              <div className="success-box">
                <div className="success-icon">&#10003;</div>
                <h3>Message Sent!</h3>
                <p>Thanks for reaching out — we'll get back to you shortly.</p>
                <button className="btn btn-primary" onClick={() => setSent(false)}>
                  Send Another Message
                </button>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit} noValidate>
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Your name"
                    value={form.name}
                    onChange={handleChange}
                  />
                  {errors.name && <span className="error">{errors.name}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                  />
                  {errors.email && <span className="error">{errors.email}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    placeholder="How can we help?"
                    value={form.message}
                    onChange={handleChange}
                  ></textarea>
                  {errors.message && (
                    <span className="error">{errors.message}</span>
                  )}
                </div>

                <button type="submit" className="btn btn-primary btn-block">
                  Send Message
                </button>
                {errors.submit && <span className="error">{errors.submit}</span>}
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
