import React from "react";
import ServiceCard from "../components/ServiceCard";
import useServices from "../hooks/useServices";
import "./Services.css";

export default function Services() {
  const services = useServices();
  return (
    <div className="services-page">
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">What We Offer</span>
          <h1>Our Services</h1>
          <p>
            Straightforward pricing, genuine parts, and mechanics who explain
            exactly what your bike needs — nothing more, nothing less.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="services-grid">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
