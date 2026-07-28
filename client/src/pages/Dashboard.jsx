import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../utils/api";
import "./Dashboard.css";

const statusClass = (status) => `status status-${status.toLowerCase().replaceAll(" ", "-")}`;

export default function Dashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    api("/bookings").then((result) => setBookings(result.bookings)).catch(() => setBookings([]));
  }, [user.id]);

  return (
    <section className="dashboard-page section">
      <div className="container">
        <div className="dashboard-head">
          <div><span className="eyebrow">Customer Portal</span><h1>Hello, {user.name}</h1><p>Track every service request in real time.</p></div>
          <Link to="/book-service" className="btn btn-primary">New Booking</Link>
        </div>
        {bookings.length ? <div className="booking-list">
          {bookings.map((booking) => <article className="booking-item" key={booking.id}>
            <div><small>Service</small><h3>{booking.serviceName}</h3><p>{booking.bikeBrand} {booking.bikeModel} · {booking.regNumber}</p></div>
            <div><small>Appointment</small><strong>{new Date(`${booking.date}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</strong></div>
            <span className={statusClass(booking.status || "Pending")}>{booking.status || "Pending"}</span>
          </article>)}
        </div> : <div className="empty-state"><h2>No bookings yet</h2><p>Your service requests will appear here.</p><Link to="/book-service" className="btn btn-dark">Book Your First Service</Link></div>}
      </div>
    </section>
  );
}
