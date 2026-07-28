import React from "react";
import { useNavigate } from "react-router-dom";
import "./ServiceCard.css";

export default function ServiceCard({ service }) {
  const navigate = useNavigate();

  const handleBookNow = () => {
    navigate("/book-service", { state: { serviceId: service.id } });
  };

  return (
    <div className="service-card">
      <div className="service-card-image">
        <img src={service.image} alt={service.name} loading="lazy" />
      </div>
      <div className="service-card-body">
        <h3>{service.name}</h3>
        <p>{service.description}</p>
        <div className="service-card-footer">
          <span className="price">₹{service.price}</span>
          <button className="btn btn-primary" onClick={handleBookNow}>
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}
