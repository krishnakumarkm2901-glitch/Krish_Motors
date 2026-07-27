import React from "react";
import { Link } from "react-router-dom";
import ServiceCard from "../components/ServiceCard";
import useServices from "../hooks/useServices";
import "./Home.css";

export default function Home() {
  const services = useServices();
  const featured = services.slice(0, 3);

  return (
    <div className="home">
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-text">
            <span className="eyebrow">Two-Wheeler Care, Done Right</span>
            <h1>
              Keep Your Ride <span>Tuned</span> &amp; Ready For The Road
            </h1>
            <p>
              From routine oil changes to full engine tune-ups, Krish_Motors'
              certified mechanics get your bike serviced fast, transparent,
              and hassle-free. Book a slot in under a minute.
            </p>
            <div className="hero-actions">
              <Link to="/book-service" className="btn btn-primary">
                Book Service
              </Link>
              <Link to="/services" className="btn btn-outline">
                View Services
              </Link>
            </div>
          </div>

          <div className="hero-image">
            <img
              src="https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=900&q=80"
              alt="Motorcycle ready for service"
            />
          </div>
        </div>
      </section>

      <div className="speed-divider"></div>

      <section className="section featured">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">Popular Picks</span>
            <h2>Featured Services</h2>
            <p>
              The three services our customers book the most, backed by
              transparent pricing and quick turnaround.
            </p>
          </div>

          <div className="services-grid">
            {featured.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
