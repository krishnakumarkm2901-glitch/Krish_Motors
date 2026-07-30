import React, { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

export default function Login({ adminMode = false }) {
  const { user, login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const role = adminMode ? "admin" : "user";
  const [registering, setRegistering] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });

  if (user) return <Navigate to={user.role === "admin" ? "/admin" : "/dashboard"} replace />;

  const update = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
    setError("");
  };
  const submit = async (event) => {
    event.preventDefault();
    if (registering && (!form.name.trim() || !/^[6-9]\d{9}$/.test(form.phone))) {
      return setError("Enter your name and a valid 10-digit mobile number.");
    }
    if (!/\S+@\S+\.\S+/.test(form.email) || form.password.length < 6) {
      return setError("Enter a valid email and a password of at least 6 characters.");
    }
    const result = await (registering ? register(form) : login({ ...form, role }));
    if (!result.ok) return setError(result.message);
    navigate(result.user.role === "admin" ? "/admin" : location.state?.from || "/dashboard", { replace: true });
  };
  return (
    <section className="auth-page">
      <div className="auth-card">
        <div className="auth-intro">
          <span className="eyebrow">{adminMode ? "Restricted Access" : "Welcome to KrishD_Motors"}</span>
          <h1>{adminMode ? "Admin Login" : registering ? "Create your account" : "User Login"}</h1>
          <p>{adminMode ? "Sign in to manage services and customer bookings." : "Manage service bookings and receive live status updates."}</p>
        </div>
        <form onSubmit={submit} className="auth-form">
          {registering && <>
            <label>Full Name<input name="name" value={form.name} onChange={update} /></label>
            <label>Phone Number<input name="phone" value={form.phone} onChange={update} maxLength="10" /></label>
          </>}
          <label>Email Address<input type="email" name="email" value={form.email} onChange={update} /></label>
          <label>Password<input type="password" name="password" value={form.password} onChange={update} /></label>
          {error && <div className="auth-error">{error}</div>}
          <button className="btn btn-primary btn-block" type="submit">
            {registering ? "Create Account" : adminMode ? "Login as Admin" : "Login as User"}
          </button>
        </form>
        {!adminMode ? (
          <button className="auth-link" onClick={() => { setRegistering((value) => !value); setError(""); }}>
            {registering ? "Already registered? Sign in" : "New customer? Create an account"}
          </button>
        ) : <div className="demo-note">Authorized administrators only</div>}
      </div>
    </section>
  );
}
