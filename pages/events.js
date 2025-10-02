// pages/api/events.js
import prisma from "../../lib/prisma";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const events = await prisma.event.findMany({
      orderBy: { startAt: "asc" },
      include: { bookings: true },
    });
    res.json(events);
  } else if (req.method === "POST") {
    const { title, description, location, startAt, endAt, capacity } = req.body;
    if (!title || !startAt) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const ev = await prisma.event.create({
      data: {
        title,
        description,
        location,
        startAt: new Date(startAt),
        endAt: new Date(endAt),
        capacity: Number(capacity) || 0,
      },
    });
    res.status(201).json(ev);
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
