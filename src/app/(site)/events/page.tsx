import { listEvents } from "@/lib/eventsDb";
import { Metadata } from "next";
import { EventsView } from "@/components/EventsView";

export const metadata: Metadata = {
  title: "Upcoming Events | Azzurri",
  description: "Discover upcoming nightlife and dining events at Azzurri.",
};

export const dynamic = "force-dynamic";

export default async function EventsPage({ searchParams }: { searchParams: Promise<{ zone?: string }> }) {
  const [events, { zone }] = await Promise.all([
    listEvents(),
    searchParams
  ]);

  return <EventsView events={events} zone={zone as 'restaurant' | 'club'} />;
}
