import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Book a Table | Azzurri",
    description: "Reserve your evening at Azzurri.",
};

export default function BookLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
