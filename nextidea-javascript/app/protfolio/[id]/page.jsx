import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import DemoDetailsClient from "./DemoDetailsClient";

export const metadata = {
  title: "Project Details | Next Idea Solutions",
  description: "View details, technologies used, and live demo of our project.",
};

export default async function Page({ params }) {
  const { id } = await params;
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-24 pb-20 bg-zinc-50">
        <DemoDetailsClient id={id} />
      </main>
      <Footer />
    </div>
  );
}
