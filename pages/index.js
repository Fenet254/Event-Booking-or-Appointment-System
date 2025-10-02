// pages/index.js
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch("/api/events")
      .then((r) => r.json())
      .then(setEvents);
  }, []);

  return (
    <div className="container">
      <div className="header">
        <h1>Event Booking</h1>
        <div>
          <Link href="/admin">
            <button className="btn">Admin</button>
          </Link>
        </div>
      </div>

      <div className="card">
        <p className="small">Browse upcoming events and book seats.</p>
      </div>

      <div className="event-list">
        {events.map((ev) => (
          <div key={ev.id} className="card">
            <h3>{ev.title}</h3>
            <p className="small">{ev.location || "Location not set"}</p>
            <p className="small">{new Date(ev.startAt).toLocaleString()}</p>
            <p>{ev.description?.slice(0, 120)}</p>
            <p className="small">
              Capacity: {ev.capacity || "Unlimited"} • Booked:{" "}
              {ev.bookings?.length || 0}
            </p>
            <div style={{ marginTop: 8 }}>
              <Link href={`/events/${ev.id}`}>
                <button className="btn">View & Book</button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
