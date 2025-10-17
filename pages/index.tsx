// pages/index.tsx
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaArrowRight } from "react-icons/fa";
import type { Event } from "../../types";

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/events")
      .then((r) => r.json())
      .then((data) => {
        setEvents(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="container flex items-center justify-center min-h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
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
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Event Booking
        </h1>
        <div>
          <Link href="/admin">
            <motion.button
              className="btn bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaUsers className="inline mr-2" />
              Admin
            </motion.button>
          </Link>
        </div>
      </motion.div>

      <motion.div
        className="card bg-gradient-to-br from-blue-50 to-indigo-100 border-l-4 border-blue-500 shadow-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <p className="small text-gray-700 font-medium">
          Browse upcoming events and book your seats with ease.
        </p>
      </motion.div>

      <div className="event-list">
        {events.map((ev, index) => (
          <motion.div
            key={ev.id}
            className="card bg-white hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl border border-gray-200 hover:border-blue-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -5 }}
          >
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-800">{ev.title}</h3>
              <div className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                ID: {ev.id}
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center text-gray-600">
                <FaMapMarkerAlt className="mr-2 text-blue-500" />
                <span className="small">{ev.location || "Location not set"}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <FaCalendarAlt className="mr-2 text-green-500" />
                <span className="small">{new Date(ev.startAt).toLocaleString()}</span>
              </div>
            </div>

            <p className="text-gray-700 mb-4 leading-relaxed">
              {ev.description?.slice(0, 120)}{ev.description && ev.description.length > 120 ? "..." : ""}
            </p>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <FaUsers className="mr-1 text-purple-500" />
                  <span>Capacity: {ev.capacity || "Unlimited"}</span>
                </div>
                <div className="flex items-center">
                  <span>Booked: {ev.bookings?.length || 0}</span>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Link href={`/events/${ev.id}`}>
                <motion.button
                  className="btn bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View & Book
                  <FaArrowRight className="inline ml-2" />
                </motion.button>
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
