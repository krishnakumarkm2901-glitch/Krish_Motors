import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { BOOKINGS_KEY, DATA_EVENT, readJson } from "../utils/storage";
import "./Dashboard.css";

const statusClass = (status) => `status status-${status.toLowerCase().replaceAll(" ", "-")}`;

export default function Dashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const refresh = () => setBookings(
      readJson(BOOKINGS_KEY, [])
        .filter((booking) => booking.userId === user.id)
        .sort((a, b) => new Date(b.bookedAt) - new Date(a.bookedAt))
    );
    refresh();
    const sync = (event) => (!event.key || event.key === BOOKINGS_KEY) && refresh();
    window.addEventListener("storage", sync);
    window.addEventListener(DATA_EVENT, sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(DATA_EVENT, sync);
    };
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
