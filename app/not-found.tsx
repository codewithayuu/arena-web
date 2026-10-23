import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Fuzzy404View } from "@/components/FuzzyText/fuzzy-404-view";

export default function NotFound() {
  return (
    <div className="relative min-h-screen bg-transparent text-foreground flex flex-col selection:bg-[#FF1018]/30 selection:text-white">
      <Navbar />
      <Fuzzy404View />
      <Footer />
    </div>
  );
}

