import React, { useState } from "react";
import "./Dealership.css";

// --- Banner Section ---
const BannerSection = () => (
  <section className="bold-banner">
    <h1>Dealership</h1>
    <p className="breadcrumb">
      <a href="/">Home</a> &gt; Dealership
    </p>
  </section>
);

// --- Form Section ---
const cityOptions = [
  "Delhi", "Dehradun", "Lucknow", "Mumbai", "Kolkata", "Chennai", "Bangalore", "Hyderabad", "Other"
];
const stateOptions = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
  "Other"
];


const DealershipForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    email: "",
    state: "",
    city: "",
    currentBusiness: "",
    firmName: "",
    turnover: "",
    gst: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  const messageDiv = document.getElementById("formMessage");
  setSubmitting(true);
  try {
    const API_BASE = (import.meta.env.VITE_API_BASE_URL || window.location.origin).replace(/\/$/, "");
    const response = await fetch(`${API_BASE}/api/dealership`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    let payload = {};
    try {
      payload = await response.json();
    } catch (_) {}

    if (!response.ok) {
      const errorText = payload?.message || `Request failed (${response.status})`;
      messageDiv.style.display = "block";
      messageDiv.className = "dealership-message error";
      messageDiv.innerText = errorText;
      return;
    }

    messageDiv.style.display = "block";
    messageDiv.className = "dealership-message success";
    messageDiv.innerText = payload?.message || "Form submitted successfully!";

    setTimeout(() => {
      window.location.href = "/";
    }, 2000);
  } catch (err) {
    messageDiv.style.display = "block";
    messageDiv.className = "dealership-message error";
    messageDiv.innerText = "Network error submitting form";
  } finally {
    setSubmitting(false);
  }
};



  return (
    <div className="dealership-root">
      <h1 className="dealership-title">Electric Scooter Dealership</h1>
      <form className="dealership-form" onSubmit={handleSubmit}>
        <div className="dealership-grid">
          <div className="dealership-field">
            <label>Name</label>
            <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="dealership-field">
            <label>Contact Number</label>
            <input type="tel" name="contact" placeholder="Contact" value={formData.contact} onChange={handleChange} required />
          </div>
          <div className="dealership-field">
            <label>Email</label>
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="dealership-field">
            <label>State</label>
            <select name="state" value={formData.state} onChange={handleChange} required>
              <option value="">-Select State-</option>
              {stateOptions.map((state) => (
                <option value={state} key={state}>{state}</option>
              ))}
            </select>
          </div>
          <div className="dealership-field">
            <label>City</label>
            <select name="city" value={formData.city} onChange={handleChange} required>
              <option value="">-Select City-</option>
              {cityOptions.map((city) => (
                <option value={city} key={city}>{city}</option>
              ))}
            </select>
          </div>
          <div className="dealership-field">
            <label>Current Business</label>
            <input type="text" name="currentBusiness" placeholder="Current Business" value={formData.currentBusiness} onChange={handleChange} />
          </div>
          <div className="dealership-field">
            <label>Firm Name</label>
            <input type="text" name="firmName" placeholder="Firm Name" value={formData.firmName} onChange={handleChange} />
          </div>
          <div className="dealership-field">
            <label>Current Business Turnover</label>
            <input type="text" name="turnover" placeholder="Current Business Turnover" value={formData.turnover} onChange={handleChange} />
          </div>
          <div className="dealership-field">
            <label>GST No.</label>
            <input type="text" name="gst" placeholder="GST No." value={formData.gst} onChange={handleChange} />
          </div>
          <div className="dealership-field dealership-field--full">
            <label>Message</label>
            <textarea name="message" rows={3} placeholder="Type your message..." value={formData.message} onChange={handleChange} />
          </div>
        </div>
        <div className="dealership-message" id="formMessage"></div>
        <div className="dealership-actions">
          <button type="submit" disabled={submitting}>{submitting ? "Submitting..." : "Submit"}</button>
        </div>
      </form>
    </div>
  );
};

// --- Main Page Export ---
const Dealership = () => (
  <>
    <BannerSection />
    <DealershipForm />
  </>
);

export default Dealership;
