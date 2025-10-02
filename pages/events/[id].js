// pages/events/[id].js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function EventPage() {
  const router = useRouter();
  const { id } = router.query;
  const [event, setEvent] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", seats: 1 });
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!id) return;
    fetch(`/api/events/${id}`)
      .then((r) => r.json())
      .then(setEvent);
  }, [id]);

  async function submit(e) {
    e.preventDefault();
    setMessage("Submitting...");
    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventId: id, ...form }),
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error || "Booking failed");
    } else {
      setMessage("Booking confirmed! ID: " + data.id);
      setForm({ name: "", email: "", seats: 1 });
      // refresh event
      fetch(`/api/events/${id}`)
        .then((r) => r.json())
        .then(setEvent);
    }
  }

  if (!event)
    return (
      <div className="container">
        <p>Loading...</p>
        <p>
          <Link href="/">
            <a>Back</a>
          </Link>
        </p>
      </div>
    );

  const booked = event.bookings.reduce((s, b) => s + b.seats, 0);
  const available =
    event.capacity > 0 ? Math.max(0, event.capacity - booked) : "Unlimited";

  return (
    <div className="container">
      <div className="header">
        <h1>{event.title}</h1>
        <Link href="/">
          <button className="btn">Home</button>
        </Link>
      </div>

      <div className="card">
        <p className="small">{event.location}</p>
        <p className="small">
          {new Date(event.startAt).toLocaleString()} —{" "}
          {new Date(event.endAt).toLocaleString()}
        </p>
        <p>{event.description}</p>
        <p className="small">
          Capacity: {event.capacity || "Unlimited"} • Booked seats: {booked} •
          Available: {available}
        </p>
      </div>

      <div className="card">
        <h3>Book this event</h3>
        <form onSubmit={submit}>
          <div className="form-row">
            <label className="small">Name</label>
            <input
              className="input"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="form-row">
            <label className="small">Email</label>
            <input
              className="input"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div className="form-row">
            <label className="small">Seats</label>
            <input
              className="input"
              type="number"
              min="1"
              value={form.seats}
              onChange={(e) =>
                setForm({ ...form, seats: Number(e.target.value) })
              }
            />
          </div>
          <button className="btn" type="submit">
            Confirm Booking
          </button>
        </form>
        <p className="small" style={{ marginTop: 8 }}>
          {message}
        </p>
      </div>

      <div className="card">
        <h4>Bookings</h4>
        {event.bookings.length === 0 ? (
          <p className="small">No bookings yet.</p>
        ) : (
          <ul>
            {event.bookings.map((b) => (
              <li key={b.id} className="small">
                {b.name} • {b.seats} seat(s) •{" "}
                {new Date(b.createdAt).toLocaleString()}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
