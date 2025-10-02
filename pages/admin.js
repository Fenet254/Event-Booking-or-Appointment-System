// pages/admin.js
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Admin() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    startAt: "",
    endAt: "",
    capacity: 0,
  });

  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetch("/api/events")
      .then((r) => r.json())
      .then(setEvents);
    fetch("/api/bookings")
      .then((r) => r.json())
      .then(setBookings);
  }, []);

  async function create(e) {
    e.preventDefault();
    const res = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (res.ok) {
      setEvents((prev) => [data, ...prev]);
      setForm({
        title: "",
        description: "",
        location: "",
        startAt: "",
        endAt: "",
        capacity: 0,
      });
    } else {
      alert(data.error || "Failed");
    }
  }

  return (
    <div className="container">
      <div className="header">
        <h1>Admin</h1>
        <Link href="/">
          <button className="btn">Public</button>
        </Link>
      </div>

      <div className="card">
        <h3>Create Event</h3>
        <form onSubmit={create}>
          <div className="form-row">
            <label className="small">Title</label>
            <input
              className="input"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>
          <div className="form-row">
            <label className="small">Description</label>
            <textarea
              className="input"
              rows="3"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>
          <div className="form-row">
            <label className="small">Location</label>
            <input
              className="input"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />
          </div>
          <div className="form-row">
            <label className="small">Start (ISO)</label>
            <input
              className="input"
              placeholder="2025-10-10T14:00"
              value={form.startAt}
              onChange={(e) => setForm({ ...form, startAt: e.target.value })}
            />
          </div>
          <div className="form-row">
            <label className="small">End (ISO)</label>
            <input
              className="input"
              placeholder="2025-10-10T16:00"
              value={form.endAt}
              onChange={(e) => setForm({ ...form, endAt: e.target.value })}
            />
          </div>
          <div className="form-row">
            <label className="small">Capacity (0 = unlimited)</label>
            <input
              type="number"
              className="input"
              value={form.capacity}
              onChange={(e) =>
                setForm({ ...form, capacity: Number(e.target.value) })
              }
            />
          </div>
          <button className="btn" type="submit">
            Create
          </button>
        </form>
      </div>

      <div className="card">
        <h3>Events</h3>
        {events.map((ev) => (
          <div
            key={ev.id}
            style={{ borderBottom: "1px solid #eee", padding: "8px 0" }}
          >
            <strong>{ev.title}</strong>{" "}
            <div className="small">{new Date(ev.startAt).toLocaleString()}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <h3>All Bookings</h3>
        {bookings.length === 0 ? (
          <p className="small">No bookings yet.</p>
        ) : (
          <ul>
            {bookings.map((b) => (
              <li key={b.id} className="small">
                {b.name} ({b.email}) • {b.seats} seats • for event {b.eventId} •{" "}
                {new Date(b.createdAt).toLocaleString()}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
