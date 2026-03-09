import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="pt-20 flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
