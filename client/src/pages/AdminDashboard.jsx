import React, { useEffect, useMemo, useState } from "react";
import useServices from "../hooks/useServices";
import { api } from "../utils/api";
import "./Dashboard.css";

const statuses = ["Pending", "Contacted", "Confirmed", "In Service", "Delivered", "Cancelled"];
const blankService = { name: "", description: "", price: "", image: "" };

export default function AdminDashboard() {
  const services = useServices();
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [tab, setTab] = useState("bookings");
  const [serviceForm, setServiceForm] = useState(blankService);
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [serviceMessage, setServiceMessage] = useState("");

  useEffect(() => {
    Promise.all([
      api("/admin/bookings"), api("/admin/contacts"), api("/admin/users"),
    ]).then(([bookingData, contactData, userData]) => {
      setBookings(bookingData.bookings);
      setMessages(contactData.messages);
      setUsers(userData.users);
    });
  }, []);

  const counts = useMemo(() => ({
    total: bookings.length,
    pending: bookings.filter((item) => (item.status || "Pending") === "Pending").length,
    delivered: bookings.filter((item) => item.status === "Delivered").length,
  }), [bookings]);

  const updateStatus = async (id, status) => {
    await api(`/admin/bookings/${id}`, { method: "PATCH", body: JSON.stringify({ status }) });
    setBookings((items) => items.map((item) => item.id === id ? { ...item, status } : item));
  };

  const contactCustomer = (booking) => {
    updateStatus(booking.id, "Contacted");
    window.location.href = `tel:${booking.phone}`;
  };

  const updateMessage = async (id, status) => {
    await api(`/admin/contacts/${id}`, { method: "PATCH", body: JSON.stringify({ status }) });
    setMessages((items) => items.map((item) => item.id === id ? { ...item, status } : item));
  };

  const replyToMessage = (item) => {
    updateMessage(item.id, "Replied");
    window.location.href = `mailto:${item.email}?subject=${encodeURIComponent("Reply from Krish_Motors")}`;
  };

  const deleteMessage = async (item) => {
    if (!window.confirm(`Delete the message from ${item.name}?`)) return;
    await api(`/admin/contacts/${item.id}`, { method: "DELETE" });
    setMessages((items) => items.filter((message) => message.id !== item.id));
  };

  const setImageFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return setServiceMessage("Please select or paste a valid image.");
    if (file.size > 2 * 1024 * 1024) return setServiceMessage("Image must be smaller than 2 MB.");
    const reader = new FileReader();
    reader.onload = () => {
      setServiceForm((current) => ({ ...current, image: reader.result }));
      setServiceMessage("Image added.");
    };
    reader.readAsDataURL(file);
  };

  const pasteImage = (event) => {
    const file = Array.from(event.clipboardData?.files || []).find((item) => item.type.startsWith("image/"));
    if (file) {
      event.preventDefault();
      setImageFile(file);
    }
  };

  const saveService = async (event) => {
    event.preventDefault();
    if (!serviceForm.name.trim() || !serviceForm.description.trim() || Number(serviceForm.price) <= 0) {
      return setServiceMessage("Name, description, and a valid price are required.");
    }
    const service = {
      ...serviceForm,
      name: serviceForm.name.trim(),
      description: serviceForm.description.trim(),
      price: Number(serviceForm.price),
      image: serviceForm.image || "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=600&q=80",
    };
    await api(editingServiceId ? `/services/${editingServiceId}` : "/services", {
      method: editingServiceId ? "PUT" : "POST", body: JSON.stringify(service),
    });
    setServiceForm(blankService);
    setEditingServiceId(null);
    setServiceMessage(editingServiceId ? "Service updated." : "Service added.");
    window.setTimeout(() => window.location.reload(), 400);
  };

  const editService = (service) => {
    setEditingServiceId(service.id);
    setServiceForm({ name: service.name, description: service.description, price: service.price, image: service.image });
    setServiceMessage("");
  };

  const deleteService = async (service) => {
    if (!window.confirm(`Delete "${service.name}"?`)) return;
    await api(`/services/${service.id}`, { method: "DELETE" });
    window.location.reload();
  };

  return (
    <section className="dashboard-page section">
      <div className="container">
        <div className="dashboard-head">
          <div><span className="eyebrow">Admin Portal</span><h1>Customer Management</h1><p>Manage customer bookings, messages, and registered users.</p></div>
        </div>
        <div className="admin-tabs">
          <button className={tab === "bookings" ? "active" : ""} onClick={() => setTab("bookings")}>Customer Bookings</button>
          <button className={tab === "messages" ? "active" : ""} onClick={() => setTab("messages")}>
            Messages ({messages.filter((item) => item.status === "Unread").length})
          </button>
          <button className={tab === "users" ? "active" : ""} onClick={() => setTab("users")}>Registered Users ({users.length})</button>
          <button className={tab === "services" ? "active" : ""} onClick={() => setTab("services")}>Services</button>
        </div>

        {tab === "bookings" ? <>
          <div className="stat-grid">
            <div><strong>{counts.total}</strong><span>Total bookings</span></div>
            <div><strong>{counts.pending}</strong><span>Pending</span></div>
            <div><strong>{counts.delivered}</strong><span>Delivered</span></div>
          </div>
          {bookings.length ? <div className="admin-table-wrap"><table className="admin-table">
            <thead><tr><th>Customer</th><th>Bike &amp; Service</th><th>Date</th><th>Contact</th><th>Status</th></tr></thead>
            <tbody>{bookings.map((booking) => <tr key={booking.id}>
              <td><strong>{booking.name}</strong><small>{booking.phone}<br />{booking.userEmail}</small></td>
              <td><strong>{booking.serviceName}</strong><small>{booking.bikeBrand} {booking.bikeModel}<br />{booking.regNumber}</small></td>
              <td>{new Date(`${booking.date}T00:00:00`).toLocaleDateString("en-IN")}</td>
              <td><button className="table-action contact" onClick={() => contactCustomer(booking)}>Call User</button></td>
              <td><select value={booking.status || "Pending"} onChange={(event) => updateStatus(booking.id, event.target.value)}>{statuses.map((status) => <option key={status}>{status}</option>)}</select></td>
            </tr>)}</tbody>
          </table></div> : <div className="empty-state"><h2>No bookings received</h2><p>New customer requests will appear here automatically.</p></div>}
        </> : tab === "messages" ? (
          messages.length ? <div className="message-list">
            {messages.map((item) => <article className={`message-card ${item.status === "Unread" ? "unread" : ""}`} key={item.id}>
              <div className="message-meta">
                <div><h3>{item.name}</h3><a href={`mailto:${item.email}`}>{item.email}</a></div>
                <div><span className={`message-status ${item.status.toLowerCase()}`}>{item.status}</span><small>{new Date(item.sentAt).toLocaleString("en-IN")}</small></div>
              </div>
              <p>{item.message}</p>
              <div className="message-actions">
                {item.status === "Unread" && <button className="table-action" onClick={() => updateMessage(item.id, "Read")}>Mark Read</button>}
                <button className="table-action contact" onClick={() => replyToMessage(item)}>Reply by Email</button>
                <button className="table-action danger" onClick={() => deleteMessage(item)}>Delete</button>
              </div>
            </article>)}
          </div> : <div className="empty-state"><h2>No messages</h2><p>Contact-form messages will appear here automatically.</p></div>
        ) : tab === "users" ? (
          users.length ? <div className="admin-table-wrap"><table className="admin-table">
            <thead><tr><th>User</th><th>Contact</th><th>Registered</th><th>Last Login</th><th>Bookings</th></tr></thead>
            <tbody>{users.map((customer) => <tr key={customer.id}>
              <td><strong>{customer.name}</strong><small>ID: {customer.id}</small></td>
              <td><strong>{customer.phone}</strong><small>{customer.email}</small></td>
              <td>{customer.registeredAt ? new Date(customer.registeredAt).toLocaleString("en-IN") : "Existing user"}</td>
              <td>{customer.lastLogin ? new Date(customer.lastLogin).toLocaleString("en-IN") : "Not recorded"}</td>
              <td><span className="user-booking-count">{bookings.filter((booking) => booking.userId === customer.id).length}</span></td>
            </tr>)}</tbody>
          </table></div> : <div className="empty-state"><h2>No registered users</h2><p>New customer accounts will appear here automatically.</p></div>
        ) : tab === "services" ? <div className="service-admin-grid">
          <form className="service-editor" onSubmit={saveService}>
            <h2>{editingServiceId ? "Edit Service" : "Add Service"}</h2>
            <label>Service Name<input value={serviceForm.name} onChange={(event) => setServiceForm({ ...serviceForm, name: event.target.value })} /></label>
            <label>Description<textarea rows="4" value={serviceForm.description} onChange={(event) => setServiceForm({ ...serviceForm, description: event.target.value })} /></label>
            <label>Price (₹)<input type="number" min="1" value={serviceForm.price} onChange={(event) => setServiceForm({ ...serviceForm, price: event.target.value })} /></label>
            <label>Service Image
              <div className="image-input-area" onPaste={pasteImage}>
                {serviceForm.image && <img src={serviceForm.image} alt="Service preview" />}
                <input type="text" placeholder="Paste an image or image URL here" value={serviceForm.image.startsWith("data:") ? "" : serviceForm.image} onChange={(event) => setServiceForm({ ...serviceForm, image: event.target.value })} />
                <input type="file" accept="image/*" onChange={(event) => setImageFile(event.target.files[0])} />
                <small>Click here and press Ctrl+V to paste a copied image. Maximum 2 MB.</small>
              </div>
            </label>
            {serviceMessage && <p className="form-message">{serviceMessage}</p>}
            <div className="editor-actions">
              <button className="btn btn-primary" type="submit">{editingServiceId ? "Update Service" : "Add Service"}</button>
              {editingServiceId && <button className="btn btn-dark" type="button" onClick={() => { setEditingServiceId(null); setServiceForm(blankService); }}>Cancel</button>}
            </div>
          </form>
          <div className="managed-services">
            <h2>Available Services ({services.length})</h2>
            {services.map((service) => <article key={service.id}>
              <img src={service.image} alt="" />
              <div><h3>{service.name}</h3><p>₹{service.price}</p></div>
              <button className="table-action" onClick={() => editService(service)}>Edit</button>
              <button className="table-action danger" onClick={() => deleteService(service)}>Delete</button>
            </article>)}
          </div>
        </div> : null}
      </div>
    </section>
  );
}
