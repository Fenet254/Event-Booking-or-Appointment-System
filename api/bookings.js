// pages/api/bookings.js
import prisma from "../../lib/prisma";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { eventId, name, email, seats } = req.body;
    if (!eventId || !name || !email) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const ev = await prisma.event.findUnique({
      where: { id: Number(eventId) },
      include: { bookings: true },
    });
    if (!ev) return res.status(404).json({ error: "Event not found" });

    // compute already booked seats
    const bookedSeats = ev.bookings.reduce((sum, b) => sum + b.seats, 0);
    const seatsRequested = Number(seats || 1);

    if (ev.capacity > 0 && bookedSeats + seatsRequested > ev.capacity) {
      return res.status(400).json({ error: "Not enough seats available" });
    }

    const booking = await prisma.booking.create({
      data: {
        eventId: ev.id,
        name,
        email,
        seats: seatsRequested,
      },
    });

    res.status(201).json(booking);
  } else if (req.method === "GET") {
    // Return all bookings (admin)
    const bookings = await prisma.booking.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(bookings);
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
