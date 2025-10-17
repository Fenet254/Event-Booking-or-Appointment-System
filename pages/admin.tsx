// pages/admin.tsx
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaHome, FaPlus, FaCalendarAlt, FaTicketAlt, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import type { Event, Booking, EventForm } from "../../types";

export default function Admin() {
  const [events, setEvents] = useState<Event[]>([]);
  const [form, setForm] = useState<EventForm>({
    title: "",
    description: "",
    location: "",
    startAt: "",
    endAt: "",
    capacity: 0,
  });
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/events").then(r => r.json()),
      fetch("/api/bookings").then(r => r.json())
    ]).then(([eventsData, bookingsData]) => {
      setEvents(eventsData);
      setBookings(bookingsData);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

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
      setMessage({ type: 'success', text: 'Event created successfully!' });
    } else {
      setMessage({ type: 'error', text: data.error || "Failed to create event" });
    }
    setSubmitting(false);
  }

  if (loading) {
    return (
      <div className="container flex items-center justify-center min-h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="container">
      <motion.div
        className="header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Admin Panel
        </h1>
        <Link href="/">
          <motion.button
            className="btn bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaHome className="inline mr-2" />
            Public View
          </motion.button>
        </Link>
      </motion.div>

      <motion.div
        className="card bg-gradient-to-br from-purple-50 to-pink-100 border-l-4 border-purple-500 shadow-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <FaPlus className="mr-2 text-purple-600" />
          Create New Event
        </h3>
        {message && (
          <motion.div
            className={`mb-4 p-3 rounded-lg flex items-center ${
              message.type === 'success'
                ? 'bg-green-100 text-green-800 border border-green-200'
                : 'bg-red-100 text-red-800 border border-red-200'
            }`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            {message.type === 'success' ? (
              <FaCheckCircle className="mr-2" />
            ) : (
              <FaExclamationTriangle className="mr-2" />
            )}
            {message.text}
          </motion.div>
        )}
        <form onSubmit={create} className="space-y-4">
          <div className="form-row">
            <label className="small font-medium text-gray-700">Title *</label>
            <input
              className="input border-2 border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>
          <div className="form-row">
            <label className="small font-medium text-gray-700">Description</label>
            <textarea
              className="input border-2 border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200"
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div className="form-row">
            <label className="small font-medium text-gray-700">Location</label>
            <input
              className="input border-2 border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-row">
              <label className="small font-medium text-gray-700">Start Date & Time *</label>
              <input
                type="datetime-local"
                className="input border-2 border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200"
                value={form.startAt}
                onChange={(e) => setForm({ ...form, startAt: e.target.value })}
                required
              />
            </div>
            <div className="form-row">
              <label className="small font-medium text-gray-700">End Date & Time *</label>
              <input
                type="datetime-local"
                className="input border-2 border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200"
                value={form.endAt}
                onChange={(e) => setForm({ ...form, endAt: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="form-row">
            <label className="small font-medium text-gray-700">Capacity (0 = unlimited)</label>
            <input
              type="number"
              className="input border-2 border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200"
              value={form.capacity}
              onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })}
              min="0"
            />
          </div>
          <motion.button
            type="submit"
            className="btn bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: submitting ? 1 : 1.05 }}
            whileTap={{ scale: submitting ? 1 : 0.95 }}
            disabled={submitting}
          >
            {submitting ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full inline mr-2"
                />
                Creating...
              </>
            ) : (
              <>
                <FaPlus className="inline mr-2" />
                Create Event
              </>
            )}
          </motion.button>
        </form>
      </motion.div>

      <motion.div
        className="card bg-white shadow-xl border border-gray-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <FaCalendarAlt className="mr-2 text-blue-600" />
          Events ({events.length})
        </h3>
        {events.length === 0 ? (
          <p className="small text-gray-500">No events created yet.</p>
        ) : (
          <div className="space-y-3">
            {events.map((ev, index) => (
              <motion.div
                key={ev.id}
                className="border-b border-gray-200 pb-3 last:border-b-0 hover:bg-gray-50 p-3 rounded-lg transition-colors duration-200"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <strong className="text-lg text-gray-800">{ev.title}</strong>
                    <div className="small text-gray-600 mt-1">
                      {new Date(ev.startAt).toLocaleString()}
                    </div>
                    <div className="small text-gray-500">
                      Capacity: {ev.capacity || "Unlimited"} • Booked: {ev.bookings?.length || 0}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    ID: {ev.id}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      <motion.div
        className="card bg-white shadow-xl border border-gray-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <FaTicketAlt className="mr-2 text-green-600" />
          All Bookings ({bookings.length})
        </h3>
        {bookings.length === 0 ? (
          <p className="small text-gray-500">No bookings yet.</p>
        ) : (
          <div className="space-y-2">
            {bookings.map((b, index) => (
              <motion.div
                key={b.id}
                className="small bg-gray-50 p-3 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors duration-200"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.02 }}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-medium text-gray-800">{b.name}</span>
                    <span className="text-gray-600"> ({b.email})</span>
                    <span className="text-gray-500"> • {b.seats} seat{b.seats !== 1 ? 's' : ''}</span>
                    <span className="text-gray-500"> • Event {b.eventId}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(b.createdAt).toLocaleString()}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
