import { listEvents } from "@/lib/eventsDb";
import { Metadata } from "next";
import { EventsView } from "@/components/EventsView";

export const metadata: Metadata = {
  title: "Upcoming Events | Azzurri",
  description: "Discover upcoming nightlife and dining events at Azzurri.",
};

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const events = await listEvents();

  return <EventsView events={events} />;
}
