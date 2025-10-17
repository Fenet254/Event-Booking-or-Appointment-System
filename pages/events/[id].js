// pages/events/[id].tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaHome, FaMapMarkerAlt, FaCalendarAlt, FaUsers, FaTicketAlt, FaCheckCircle, FaExclamationTriangle, FaArrowLeft } from "react-icons/fa";
import type { Event, BookingForm } from "../../../types";

export default function EventPage() {
  const router = useRouter();
  const { id } = router.query;
  const [event, setEvent] = useState<Event | null>(null);
  const [form, setForm] = useState<BookingForm>({ name: "", email: "", seats: 1 });
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info', text: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/events/${id}`)
      .then((r) => r.json())
      .then(setEvent);
  }, [id]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ type: 'info', text: "Submitting..." });

    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventId: id, ...form }),
    });
    const data = await res.json();

    if (!res.ok) {
      setMessage({ type: 'error', text: data.error || "Booking failed" });
    } else {
      setMessage({ type: 'success', text: `Booking confirmed! ID: ${data.id}` });
      setForm({ name: "", email: "", seats: 1 });
      // refresh event
      fetch(`/api/events/${id}`)
        .then((r) => r.json())
        .then(setEvent);
    }
    setSubmitting(false);
  }

  if (!event) {
    return (
      <div className="container flex items-center justify-center min-h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
        />
        <div className="ml-4">
          <Link href="/">
            <motion.button
              className="btn bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaArrowLeft className="inline mr-2" />
              Back to Home
            </motion.button>
          </Link>
        </div>
      </div>
    );
  }

  const booked = event.bookings.reduce((s, b) => s + b.seats, 0);
  const available = event.capacity > 0 ? Math.max(0, event.capacity - booked) : "Unlimited";

  return (
    <div className="container">
      <motion.div
        className="header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {event.title}
        </h1>
        <Link href="/">
          <motion.button
            className="btn bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaHome className="inline mr-2" />
            Home
          </motion.button>
        </Link>
      </motion.div>

      <motion.div
        className="card bg-gradient-to-br from-blue-50 to-indigo-100 border-l-4 border-blue-500 shadow-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="space-y-3">
          <div className="flex items-center text-gray-700">
            <FaMapMarkerAlt className="mr-2 text-blue-500" />
            <span className="font-medium">{event.location || "Location not set"}</span>
          </div>
          <div className="flex items-center text-gray-700">
            <FaCalendarAlt className="mr-2 text-green-500" />
            <span className="font-medium">
              {new Date(event.startAt).toLocaleString()} — {new Date(event.endAt).toLocaleString()}
            </span>
          </div>
          <div className="flex items-center text-gray-700">
            <FaUsers className="mr-2 text-purple-500" />
            <span className="font-medium">
              Capacity: {event.capacity || "Unlimited"} • Booked: {booked} • Available: {available}
            </span>
          </div>
        </div>
        <p className="mt-4 text-gray-800 leading-relaxed">{event.description}</p>
      </motion.div>

      <motion.div
        className="card bg-white shadow-xl border border-gray-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <FaTicketAlt className="mr-2 text-green-600" />
          Book this event
        </h3>
        {message && (
          <motion.div
            className={`mb-4 p-3 rounded-lg flex items-center ${
              message.type === 'success'
                ? 'bg-green-100 text-green-800 border border-green-200'
                : message.type === 'error'
                ? 'bg-red-100 text-red-800 border border-red-200'
                : 'bg-blue-100 text-blue-800 border border-blue-200'
            }`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            {message.type === 'success' ? (
              <FaCheckCircle className="mr-2" />
            ) : message.type === 'error' ? (
              <FaExclamationTriangle className="mr-2" />
            ) : (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full mr-2"
              />
            )}
            {message.text}
          </motion.div>
        )}
        <form onSubmit={submit} className="space-y-4">
          <div className="form-row">
            <label className="small font-medium text-gray-700">Name *</label>
            <input
              className="input border-2 border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div className="form-row">
            <label className="small font-medium text-gray-700">Email *</label>
            <input
              type="email"
              className="input border-2 border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div className="form-row">
            <label className="small font-medium text-gray-700">Number of Seats *</label>
            <input
              type="number"
              min="1"
              max="10"
              className="input border-2 border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
              value={form.seats}
              onChange={(e) => setForm({ ...form, seats: Number(e.target.value) })}
              required
            />
          </div>
          <motion.button
            type="submit"
            className="btn bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
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
                Processing...
              </>
            ) : (
              <>
                <FaCheckCircle className="inline mr-2" />
                Confirm Booking
              </>
            )}
          </motion.button>
        </form>
      </motion.div>

      <motion.div
        className="card bg-white shadow-xl border border-gray-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h4 className="text-lg font-semibold mb-4 flex items-center">
          <FaUsers className="mr-2 text-blue-600" />
          Current Bookings ({event.bookings.length})
        </h4>
        {event.bookings.length === 0 ? (
          <p className="small text-gray-500">No bookings yet.</p>
        ) : (
          <div className="space-y-2">
            {event.bookings.map((b, index) => (
              <motion.div
                key={b.id}
                className="small bg-gray-50 p-3 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors duration-200"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-medium text-gray-800">{b.name}</span>
                    <span className="text-gray-500"> • {b.seats} seat{b.seats !== 1 ? 's' : ''}</span>
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
