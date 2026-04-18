import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Your study buddy by UTN Rockstars",
  description: "Your study buddy - Manage notes, tasks, and study events with AI-powered features",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <div className="app-shell">{children}</div>
      </body>
    </html>
  );
}
